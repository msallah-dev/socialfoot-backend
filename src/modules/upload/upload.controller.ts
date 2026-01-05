import {
    BadRequestException,
    Body,
    Controller,
    HttpStatus,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('upload')
export class UploadController {

    // Upload photo de profil
    @UseGuards(AuthGuard)
    @Post('profil')
    @UseInterceptors(FileInterceptor('file', multerConfig()))
    async uploadProfil(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string) {
        // Vérifier si le fichier n'est pas vide
        if (!file || file.size > 50 * 1024) {
            return {
                success: false,
                error: "Image trop volumineuse (>50 KB)",
                status: HttpStatus.PAYLOAD_TOO_LARGE
            };
        }

        return await this.writeImage('profils', `${userId}.jpg`, file.buffer);
    }

    // Upload image de post
    @UseGuards(AuthGuard)
    @Post('post')
    @UseInterceptors(FileInterceptor('file', multerConfig()))
    async uploadPost(@UploadedFile() file: Express.Multer.File, @Body('postId') postId: string) {
        // Vérifier si le fichier n'est pas vide
        if (!file || file.size > 50 * 1024) {
            return {
                success: false,
                error: "Image trop volumineuse (>50 KB)",
                status: HttpStatus.PAYLOAD_TOO_LARGE
            };
        }

        return await this.writeImage('posts', `${postId}.jpg`, file.buffer);
    }

    private async writeImage(folder: string, fileName: string, buffer: Buffer): Promise<any> {
        await fs.promises.writeFile(
            path.join(process.cwd(), 'public/uploads', folder, fileName),
            buffer,
        );

        return {
            success: true,
            message: 'Image uploadée avec succès',
            url: `/uploads/${folder}/${fileName}`,
            status: HttpStatus.OK
        };
    }
}