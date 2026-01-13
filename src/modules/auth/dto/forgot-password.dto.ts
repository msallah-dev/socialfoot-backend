import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    
    @IsEmail({}, { message: 'Le champ E-mail doit être une adresse valide' })
    email: string;
}