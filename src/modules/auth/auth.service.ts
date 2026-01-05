import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class AuthService {

    private blacklist = new Set<string>();

    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private jwtService: JwtService
    ) { }

    verifyToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);

            return { success: true, data: payload };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    async login(authUserDto: AuthUserDto, res: Response): Promise<any> {
        const { email, password } = authUserDto;

        const existUser = await this.usersRepo.findOneBy({ email });
        if (!existUser) return {
            success: false,
            errors: { email: "E-mail invalide", password: "" },
            status: HttpStatus.BAD_REQUEST
        };

        const isPasswordValid = await this.isPasswordValid(password, existUser.password);
        if (!isPasswordValid) return {
            success: false,
            errors: { password: "Mot de passe incorrecte", email: "" },
            status: HttpStatus.BAD_REQUEST
        };

        const token = await this.authUser({ userId: existUser.id_user.toString() }, res);
        return token;
    }

    logout(token: string, res: Response) {
        if (!token) {
            return {
                success: false,
                message: 'Token manquant',
                status: HttpStatus.BAD_REQUEST
            };
        }

        this.blacklist.add(token);

        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return {
            success: true,
            message: 'Déconnexion réussie',
            status: HttpStatus.OK
        };
    }

    isBlacklisted(token: string) {
        return this.blacklist.has(token);
    }

    async checkPassword(email: string, password: string) {
        const existUser = await this.usersRepo.findOneBy({ email });

        if (existUser) {
            const isPasswordValid = await this.isPasswordValid(password, existUser.password);
            if (!isPasswordValid) {

                return {
                    success: false,
                    error: "Mot de passe incorrecte",
                    status: HttpStatus.BAD_REQUEST
                };
            } else {
                return {
                    success: true,
                    message: "Mot de passe valide",
                    status: HttpStatus.OK
                };
            }
        } else {
            return {
                success: false,
                error: "Utilisateur introuvable",
                status: HttpStatus.NOT_FOUND
            };
        }
    }

    private async isPasswordValid(password: string, hashedPassword: string): Promise<boolean> {
        const bool = await compare(password, hashedPassword);

        return bool;
    }

    // JWT
    private async authUser({ userId }: { userId: string }, res: Response): Promise<any> {
        const payload = { userId };
        const token = await this.jwtService.signAsync(payload);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 jour
        });

        return {
            success: true,
            status: HttpStatus.OK
        };
    }
}
