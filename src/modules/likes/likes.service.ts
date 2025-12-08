import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/like.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
    constructor(@InjectRepository(Like) private likesRepo: Repository<Like>) { }
    
    async create(postId: number, userId: number) {
        const existing = await this.likesRepo.findOne({
            where: {
                post: { id_post: postId },
                user: { id_user: userId }
            }
        });

        if (existing) {
            throw new ConflictException('Tu as déjà liker ce poste');
        }

        const like = await this.likesRepo.save({
            post: { id_post: postId } as Post,
            user: { id_user: userId } as User
        });

        return like;
    }

    async delete(postId: number, userId: number) {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const res = await this.likesRepo.delete({
            post: { id_post: postId } as Post,
            user: { id_user: userId } as User
        });

        if (res.affected === 0) {
            throw new NotFoundException(`La publication avec id ${postId} pas liker`);
        }

        return { message: `Like de la publication n°${postId} a été enlevé` };
    }
}
