import { MinLength } from "class-validator";

export class ResetPasswordDto {
    @MinLength(6, { message: 'Le Mot de passe doit contenir au moins 6 caractères.' })
    password: string;
}