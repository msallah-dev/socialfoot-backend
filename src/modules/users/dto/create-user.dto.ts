import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le champ nom ne doit pas être vide' })
  name: string;

  @IsNotEmpty({ message: 'Le champ prenom ne doit pas être vide' })
  prenom: string;

  @IsEmail({}, { message: 'Le champ email doit être une adresse valide' })
  email: string;

  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères.' })
  password: string;

  @IsNumber({}, { message: 'L\'âge doit être un nombre' })
  age: number;
}
