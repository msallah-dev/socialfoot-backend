import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) { }
    
    @UseGuards(AuthGuard)
    @Post()
    async createComment(@Body('content') content: string, @Body('postId') postId: number, @Req() req: any): Promise<any> {
        return await this.commentsService.create(content, postId, req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Patch(':commentId')
    async updateComment(@Param('commentId') commentId: string, @Body('content') content: string) {
        return await this.commentsService.update(+commentId, content);
    }

    @UseGuards(AuthGuard)
    @Delete(':commentId')
    async deleteComment(@Param('commentId') commentId: string) {
        return await this.commentsService.delete(+commentId);
    }
}
