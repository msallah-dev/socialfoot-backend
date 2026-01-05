import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, MinLength } from "class-validator";


export class CreatePostDto {
    @IsNotEmpty({ message: 'Le texte ne doit pas être vide' })
    @MinLength(20, { message: 'Le texte doit contenir au moins 20 caractères.' })
    content: string;

    @IsOptional()
    @Transform(({ value }) => value !== '' ? value : undefined)
    video: string;
}