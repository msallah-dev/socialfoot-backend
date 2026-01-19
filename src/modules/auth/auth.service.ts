import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { randomBytes } from 'crypto';
import { ForgotPassword } from 'src/entities/forgot-password.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {

    private blacklist = new Set<string>();

    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(ForgotPassword) private forgotPasswordRepository: Repository<ForgotPassword>,
        private jwtService: JwtService,
        private mailerService: MailerService
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

        const isPasswordValid = await this.isValid(password, existUser.password);
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
            const isPasswordValid = await this.isValid(password, existUser.password);
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

    async generateResetPasswordLink(fPDto: ForgotPasswordDto) {
        const user = await this.usersRepo.findOneBy({ email: fPDto.email });
        if (!user) return {
            success: false,
            message: "Un e‑mail de réinitialisation a été envoyé si cette adresse est enregistrée.",
            status: HttpStatus.BAD_REQUEST
        };

        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        const forgotPassword = await this.forgotPasswordRepository.save({
            token,
            user,
            expiresAt,
        });

        if (forgotPassword) {
            const link = `${process.env.CLIENT_URL}/reinitialiser-mot-de-passe?token=${token}`;
            this.sendLinkResetPassword(user.email, link);

            return {
                success: true,
                message: "Un e‑mail de réinitialisation a été envoyé si cette adresse est enregistrée.",
                status: HttpStatus.OK
            };
        }
    }

    async checkToken(token: string) {
        const forgotPassword = await this.forgotPasswordRepository.findOne({
            where: { token },
            relations: ['user']
        });

        if (!forgotPassword) {
            return {
                success: false,
                error: "Token invalide",
                status: HttpStatus.BAD_REQUEST
            };

        } else if (forgotPassword.expiresAt.getTime() < Date.now()) {
            // Supprimer le token de la table 'forgot_password'
            const res = await this.deleteToken(token);

            if (res) return {
                success: false,
                error: "Token expiré",
                status: HttpStatus.BAD_REQUEST
            };

        } else {
            return {
                success: true,
                message: "Token valide",
                data: forgotPassword.user,
                status: HttpStatus.OK
            };
        }

    }

    async reset(userId: number, resetPassword: ResetPasswordDto, token: string) {
        resetPassword.password = await this.hashPassword(resetPassword.password);

        const user = await this.usersRepo.preload({
            id_user: userId,
            ...resetPassword
        });

        if (!user) {
            return {
                success: false,
                error: "L’opération ne peut pas être effectuée pour le moment",
                status: HttpStatus.NOT_FOUND
            };
        }

        const userReset = await this.usersRepo.save(user);
        const res = await this.deleteToken(token);

        if (userReset && res) {
            this.sendPasswordResetConfirmation(userReset.email);

            return {
                success: true,
                message: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
                data: userReset,
                status: HttpStatus.OK
            };
        }

        return {
            success: false,
            error: 'Problème survenu',
            status: HttpStatus.INTERNAL_SERVER_ERROR
        };
    }

    private async deleteToken(token: string) {
        const res = await this.forgotPasswordRepository.delete({ token });

        if (res.affected === 0) return false;

        return true;
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

    private async isValid(password: string, hashedPassword: string): Promise<boolean> {
        return await compare(password, hashedPassword);
    }

    private async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }

    private async sendLinkResetPassword(email: string, link: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            html: `
                <p>Bonjour,</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
                <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé :</p>
                <a href="${link}">Réinitialiser mon mot de passe</a>
                <p>Ce lien est valable pour une durée de 10 minutes.</p>
                <p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e‑mail en toute sécurité</p>
                <p>Cordialement,</p>
                <p>L’équipe SocialFoot</p>
            `,
        });
    }

    private async sendPasswordResetConfirmation(email: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Votre mot de passe a été modifié',
            html: `
                <p>Bonjour,</p>
                <p>Nous vous confirmons que votre mot de passe a été modifié avec succès.</p>
                <p>Si vous n’êtes pas à l’origine de ce changement, veuillez contacter immédiatement notre support.</p>
                <p>Cordialement,</p>
                <p>L’équipe SocialFoot</p>
            `,
        });
    }

}
