import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('follows')
export class FollowsController {
    constructor(private followsService: FollowsService) { }

    @UseGuards(AuthGuard)
    @Get('nofolloweds')
    async getNoFolloweds(@Req() req: any) {
        return await this.followsService.noFolloweds(req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Post()
    async follow(@Body('followId') followId: number, @Req() req: any) {
        const follow = await this.followsService.create(followId, req.user.userId);

        return { message: `Vous commencez à suivre l'utilisateur ${followId}` };
    }

    @UseGuards(AuthGuard)
    @Delete(':followId')
    unFollow(@Param('followId') followId: string, @Req() req: any) {
        return this.followsService.delete(+followId, req.user.userId);
    }
}
