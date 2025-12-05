import { IsNotEmpty, MinLength } from "class-validator";


export class CreatePostDto {
    @IsNotEmpty({ message: 'Le texte ne doit pas être vide' })
    @MinLength(20, { message: 'Le texte doit contenir au moins 20 caractères.' })
    content: string;

    user_id: number;
}