import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('likes')
export class LikesController {
    constructor(private likesService: LikesService) { }
    
    @UseGuards(AuthGuard)
    @Post()
    async like(@Body('postId') postId: number, @Req() req: any) {
        const like = await this.likesService.create(postId, req.user.userId);

        return { message: `Vous avez liker la publication n° ${postId}` };
    }

    @UseGuards(AuthGuard)
    @Delete(':postId')
    dislike(@Param('postId') postId: string, @Req() req: any) {
        return this.likesService.delete(+postId, req.user.userId);
    }
}
