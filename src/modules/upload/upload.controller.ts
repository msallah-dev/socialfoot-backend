import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller('upload')
export class UploadController {

    // Upload photo de profil
    @UseGuards(AuthGuard)
    @Post('profil')
    @UseInterceptors(FileInterceptor('file', multerConfig('profils')))
    uploadProfil(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string) {
        // Vérifier si le fichier n'est pas vide
        if (!file || file.size > 50 * 1024) {
            throw new BadRequestException('Image manquante ou trop volumineuse (>50 KB)');
        }

        // Vérifier si le userId est passé dans le body
        if (!userId) {
            throw new BadRequestException('userId manquant dans le body');
        }

        return {
            message: 'Photo de profil uploadée avec succès',
            filename: file.filename,
            url: `/uploads/profils/${file.filename}`,
        };
    }

    // Upload image de post
    @Post('post')
    @UseInterceptors(FileInterceptor('file', multerConfig('posts')))
    uploadPost(@UploadedFile() file: Express.Multer.File) {
        return {
            message: 'Image de publication uploadée avec succès',
            filename: file.filename,
            url: `/uploads/posts/${file.filename}`,
        };
    }
}