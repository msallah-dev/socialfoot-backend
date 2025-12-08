import { Body, Controller, Get, Post, Request, UseGuards, Headers } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Get('check-token')
    checkToken(@Headers('authorization') auth: string) {
        const token = auth?.replace('Bearer ', '');
        return this.authService.verifyToken(token);
    }

    @Post('login')
    async authUser(@Body() authUserDto: AuthUserDto): Promise<any> {
        const jwt = await this.authService.login(authUserDto);

        return jwt;
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Headers('authorization') auth: string) {
        const token = auth?.replace('Bearer ', '');
        if (token) {
            this.authService.logout(token);
        }

        return { message: 'Déconnexion réussie' };
    }
    
}
