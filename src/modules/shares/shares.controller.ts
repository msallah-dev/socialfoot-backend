import { Body, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SharesService } from './shares.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('shares')
export class SharesController {
    constructor(private sharesService: SharesService) { }

    @UseGuards(AuthGuard)
    @Post()
    async share(@Body('postId') postId: number, @Req() req: any) {
        return await this.sharesService.create(postId, req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Delete(':postId')
    async deleteShare(@Param('postId') postId: string, @Req() req: any) {
        return await this.sharesService.delete(+postId, req.user.userId);
    }
}
