import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get()
    async findAllPosts() {
        return await this.postsService.findAllPosts();
    }

    @UseGuards(AuthGuard)
    @Get(':postId')
    findOnePost(@Param('postId') postId: string) {
        return this.postsService.findPostById(+postId);
    }

    @UseGuards(AuthGuard)
    @Post()
    async createPost(@Body('content') content: string, @Req() req: any): Promise<any> {
        const post = await this.postsService.create(content, req.user.userId);

        return { message: 'publication publiée avec succèes', data: post };
    }

    @UseGuards(AuthGuard)
    @Patch(':postId')
    updatePost(@Param('postId') postId: string, @Body('content') content: string) {
        return this.postsService.update(+postId, content);
    }

    @UseGuards(AuthGuard)
    @Delete(':postId')
    deletePost(@Param('postId') postId: string) {
        return this.postsService.delete(+postId);
    }

}
