import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Share } from 'src/entities/share.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SharesService {
    constructor(@InjectRepository(Share) private sharesRepo: Repository<Share>) { }

    async create(postId: number, userId: number) {
        const existing = await this.sharesRepo.findOne({
            where: {
                post: { id_post: postId },
                user: { id_user: userId }
            }
        });

        if (existing) {
            throw new ConflictException('Tu as déjà partagé ce poste');
        }

        const share = await this.sharesRepo.save({
            post: { id_post: postId } as Post,
            user: { id_user: userId } as User
        });

        if (share) {
            return {
                success: true,
                data: share,
                message: `Vous avez partagé la publication n° ${postId}`,
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

    async delete(postId: number, userId: number) {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const res = await this.sharesRepo.delete({
            post: { id_post: postId } as Post,
            user: { id_user: userId } as User
        });

        if (res.affected === 0) {
            return {
                success: false,
                error: "Problème survenu",
                status: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }

        return {
            success: true,
            message: `Le partage de la publication n°${postId} a été supprimé`,
            status: HttpStatus.OK
        };
    }

}
