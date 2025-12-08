import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
    constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) { }

    async findAllPosts() {
        const posts = await this.postsRepo.find({
            order: { created_at: 'DESC' },
            relations: ['comments', 'likes']
        });

        return posts;
    }

    async findPostById(postId: number): Promise<Post> {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const post = await this.postsRepo.findOne({ 
            where: { id_post: postId },
            relations: ['comments', 'likes']
        });

        if (!post)
            throw new NotFoundException(`Publication avec l'id ${postId} n'existe pas`);

        return post;
    }

    async create(content: string, userId: number) {
        const newPost = await this.postsRepo.save({ content, user: { id_user: userId } as User });

        return newPost;
    }

    async update(postId: number, content: string) {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const post = await this.postsRepo.preload({
            id_post: postId,
            content: content
        });

        if (!post) {
            throw new NotFoundException(`Publication avec l'id ${postId} n'existe pas`);
        }

        return await this.postsRepo.save(post);
    }

    async delete(postId: number) {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const res = await this.postsRepo.delete(postId);

        if (res.affected === 0) {
            throw new NotFoundException(`Publication avec id ${postId} introuvable`);
        }

        return `Publication de l'id ${postId} a été supprimée`;
    }
}
