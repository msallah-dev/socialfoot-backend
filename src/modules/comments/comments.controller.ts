import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) { }
    
    @UseGuards(AuthGuard)
    @Post()
    async createComment(@Body('content') content: string, @Body('postId') postId: number, @Req() req: any): Promise<any> {
        const post = await this.commentsService.create(content, postId, req.user.userId);

        return { message: 'Commentaire publiée avec succèes', data: post };
    }

    @UseGuards(AuthGuard)
    @Patch(':commentId')
    updateComment(@Param('commentId') commentId: string, @Body('content') content: string) {
        return this.commentsService.update(+commentId, content);
    }

    @UseGuards(AuthGuard)
    @Delete(':commentId')
    deleteComment(@Param('commentId') commentId: string) {
        return this.commentsService.delete(+commentId);
    }
}
