import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  name: string;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  prenom: string;

  @IsEmail({}, { message: 'Le champ E-mail doit être une adresse valide' })
  email: string;

  @IsOptional()
  @Transform(({ value }) => value === '' ? undefined : value)
  @MinLength(6, { message: 'Le Mot de passe doit contenir au moins 6 caractères.' })
  password: string
}
