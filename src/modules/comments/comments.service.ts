import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comment) private commentsRepo: Repository<Comment>) { }

    async create(content: string, postId: number, userId: number) {
        const newComment = await this.commentsRepo.save({
            content,
            post: { id_post: postId } as Post,
            user: { id_user: userId } as User
        });

        if (newComment) {
            return {
                success: true,
                message: 'Commentaire publiée avec succèes',
                data: newComment,
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

    async update(commentId: number, content: string) {
        if (isNaN(commentId)) {
            throw new BadRequestException('ID commentaire invalide');
        }

        const comment = await this.commentsRepo.preload({
            id_commentaire: commentId,
            content: content
        });

        if (!comment) {
            return {
                success: false,
                error: `Commentaire avec l'id ${commentId} n'existe pas`,
                status: HttpStatus.NOT_FOUND
            };
        }

        const commentUpdated = await this.commentsRepo.save(comment);
        return {
            success: true,
            data: commentUpdated,
            status: HttpStatus.OK
        };
    }

    async delete(commentId: number) {
        if (isNaN(commentId)) {
            throw new BadRequestException('ID commentaire invalide');
        }

        const res = await this.commentsRepo.delete(commentId);

        if (res.affected === 0) {
            return {
                success: false,
                error: `Commentaire avec id ${commentId} introuvable`,
                status: HttpStatus.NOT_FOUND
            };
        }

        return {
            success: true,
            message: `Commentaire de l'id ${commentId} a été supprimée`,
            status: HttpStatus.OK
        };
    }

}
