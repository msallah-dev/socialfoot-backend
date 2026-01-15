import { BadRequestException, HttpStatus, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, existsSync } from 'fs';
import { unlink } from 'fs/promises'
import { join } from 'path';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) { }

    async findAllPosts() {
        const posts = await this.postsRepo.find({
            order: { created_at: 'DESC' },
            relations: ['user', 'comments.user', 'likes.user', 'shares.user']
        });

        if (posts) {
            return {
                success: true,
                data: posts,
                status: HttpStatus.OK
            };
        } else {
            return {
                success: false,
                error: "Problème survenu",
                status: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }
    }

    async findPostById(postId: number): Promise<Post> {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const post = await this.postsRepo.findOne({
            where: { id_post: postId },
            relations: ['user', 'comments', 'likes']
        });

        if (!post)
            throw new NotFoundException(`Publication avec l'id ${postId} n'existe pas`);

        return post;
    }

    async create(postDto: CreatePostDto, userId: number) {
        const post = await this.postsRepo.save({
            ...postDto,
            user: { id_user: userId } as User
        });

        if (post) {
            return {
                success: true,
                message: 'publication publiée avec succèes',
                data: post,
                status: HttpStatus.OK
            };
        } else {
            return {
                success: false,
                error: "Problème survenu",
                status: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }
    }

    async update(postId: number, updatePost: UpdatePostDto) {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const post = await this.postsRepo.preload({
            id_post: postId,
            ...updatePost
        });

        if (!post) {
            return {
                success: false,
                error: `Publication avec l'id ${postId} n'existe pas`,
                status: HttpStatus.NOT_FOUND
            };
        }

        const postUpdated = await this.postsRepo.save(post);
        return {
            success: true,
            data: postUpdated,
            status: HttpStatus.OK
        };
    }

    async delete(postId: number) {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const res = await this.postsRepo.delete(postId);

        if (res.affected === 0) return {
            success: false,
            error: `Publication avec id ${postId} introuvable`,
            status: HttpStatus.NOT_FOUND
        };


        return {
            success: true,
            message: `Publication de l'id ${postId} a été supprimée`,
            status: HttpStatus.OK
        };
    }

    getImagePost(postId: string): StreamableFile | null {
        const filePath = join(process.cwd(), 'public/uploads/posts', `${postId}.jpg`);

        if (!existsSync(filePath)) return null;

        return new StreamableFile(createReadStream(filePath));
    }

    async deleteImage(filename: string) {
        const filePath = join(process.cwd(), 'public/uploads/posts', filename);

        try {
            await unlink(filePath);

            return {
                success: true,
                message: 'Image supprimée avec succès',
                status: HttpStatus.OK
            };
        } catch (error) {
            return {
                success: false,
                error: `Image introuvable. Error: ${error}`,
                status: HttpStatus.NOT_FOUND
            };
        }
    }
}
