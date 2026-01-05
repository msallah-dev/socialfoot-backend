import { Transform } from "class-transformer";
import { IsOptional, MinLength } from "class-validator";

export class UpdatePostDto {
    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    @MinLength(20, { message: 'Le contenu doit contenir au moins 20 caractères.' })
    content: string;

    @IsOptional()
    @Transform(({ value }) => value === '' ? undefined : value)
    video: string;
}