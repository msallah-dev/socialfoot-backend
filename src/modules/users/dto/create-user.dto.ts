import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le champ Nom ne doit pas être vide' })
  name: string;

  @IsNotEmpty({ message: 'Le champ Prenom ne doit pas être vide' })
  prenom: string;

  @IsEmail({}, { message: 'Le champ E-mail doit être une adresse valide' })
  email: string;
 
  @IsNumber({}, { message: 'L\'âge doit être un nombre' })
  age: number;

  @MinLength(6, { message: 'Le Mot de passe doit contenir au moins 6 caractères.' })
  password: string;

}
