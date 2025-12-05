import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { compare } from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'src/modules/users/dto/response-user.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService, private jwtService: JwtService) { }

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

        const existUser = await this.userService.findByEmail(email);
        if (!existUser) throw new NotFoundException({ error: 'Mot de passe ou email invalide' });

        const isPasswordValid = await this.isPasswordValid(password, existUser.password);
        if (!isPasswordValid) throw new NotFoundException({ error: 'Mot de passe incorrecte' });

        const token = await this.authUser({ userId: existUser.id_user.toString(), email: existUser.email });
        return token;
    }

    async getProfile(email: string): Promise<UserResponseDto> {
        const user = await this.userService.findByEmail(email);

        if (!user) throw new NotFoundException({ error: 'Utilisateur n\'existe pas !' });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
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
