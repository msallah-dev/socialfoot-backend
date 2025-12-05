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
    @Get('profile')
    async getProfile(@Request() req): Promise<any> {
        console.log(req.user);

        return await this.authService.getProfile(req.user.email);
    }

}
