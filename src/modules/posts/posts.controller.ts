import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async findAllPosts() {
        return await this.postsService.findAllPosts();
    }

    @UseGuards(AuthGuard)
    @Get(':postId')
    async findOnePost(@Param('postId') postId: string) {
        return await this.postsService.findPostById(+postId);
    }

    @UseGuards(AuthGuard)
    @Post()
    async createPost(@Body() postDto: CreatePostDto, @Req() req: any): Promise<any> {
        return await this.postsService.create(postDto, req.user.userId);
    }

    @UseGuards(AuthGuard)
    @Patch(':postId')
    async updatePost(@Param('postId') postId: string, @Body() updatePost: UpdatePostDto) {
        return await this.postsService.update(+postId, updatePost);
    }

    @UseGuards(AuthGuard)
    @Delete(':postId')
    async deletePost(@Param('postId') postId: string) {
        return await this.postsService.delete(+postId);
    }

    @Get('picture/post/:postId')
    getImageProfil(@Param('postId') postId: string) {
        return this.postsService.getImagePost(postId);
    }

    @Delete('picture/post/:filename')
    async deleteImage(@Param('filename') filename: string) {
        return await this.postsService.deleteImage(filename);
    }
    
}
