import { IsEmail, MinLength } from "class-validator";

export class AuthUserDto {
    
    @IsEmail({}, { message: 'Le champ E-mail doit être une adresse valide' })
    email: string;

    @MinLength(6, { message: 'Le Mot de passe doit contenir au moins 6 caractères.' })
    password: string;
}