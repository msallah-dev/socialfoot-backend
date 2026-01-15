import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('likes')
export class LikesController {
    constructor(private likesService: LikesService) { }
    
    @UseGuards(AuthGuard)
    @Post()
    async like(@Body('postId') postId: number, @Req() req: any) {
        return await this.likesService.create(postId, req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Delete(':postId')
    async dislike(@Param('postId') postId: string, @Req() req: any) {
        return await this.likesService.delete(+postId, req.user.userId);
    }
}
