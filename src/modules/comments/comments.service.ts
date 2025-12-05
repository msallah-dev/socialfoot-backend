import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
    constructor(@InjectRepository(Comment) private commentsRepo: Repository<Comment>) { }

    async findAllCommentsByPost(postId: number): Promise<Comment[]> {
        if (isNaN(postId)) {
            throw new BadRequestException('ID post invalide');
        }

        const comments = await this.commentsRepo.findBy({ post: { id_post: postId } as Post });

        if (!comments)
            throw new NotFoundException(`La publication n° ${postId} n'existe pas`);

        return comments;
    }

    async create(content: string, postId: number, userId: number) {
        const newComment = await this.commentsRepo.save({
            content,
            post: { id_post: postId } as Post,
            user: { id_user: userId } as User
        });

        return newComment;
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
            throw new NotFoundException(`Commentaire avec l'id ${commentId} n'existe pas`);
        }

        return await this.commentsRepo.save(comment);
    }

    async delete(commentId: number) {
        if (isNaN(commentId)) {
            throw new BadRequestException('ID commentaire invalide');
        }

        const res = await this.commentsRepo.delete(commentId);

        if (res.affected === 0) {
            throw new NotFoundException(`Commentaire avec id ${commentId} introuvable`);
        }

        return `Commentaire de l'id ${commentId} a été supprimée`;
    }
}
