import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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

            return { valid: true, payload };
        } catch (err) {
            return { valid: false, error: err.message };
        }
    }

    async login(authUserDto: AuthUserDto): Promise<any> {
        const { email, password } = authUserDto;

        const existUser = await this.usersRepo.findOneBy({ email });
        if (!existUser) throw new NotFoundException({ error: 'E-mail invalide' });

        const isPasswordValid = await this.isPasswordValid(password, existUser.password);
        if (!isPasswordValid) throw new NotFoundException({ error: 'Mot de passe incorrecte' });

        const token = await this.authUser({ userId: existUser.id_user.toString(), email: existUser.email });
        return token;
    }

    logout(token: string) {
        this.blacklist.add(token);
    }

    isBlacklisted(token: string) {
        return this.blacklist.has(token);
    }

    private async isPasswordValid(password: string, hashedPassword: string): Promise<boolean> {
        const bol = await compare(password, hashedPassword);

        return bol;
    }

    // JWT
    private async authUser({ userId, email }: { userId: string, email: string }): Promise<any> {
        const payload = { userId, email };
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token };
    }
}
