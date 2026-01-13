import { Body, Controller, Get, Post, UseGuards, Res, Req, Param, Patch } from '@nestjs/common';
import { AuthUserDto } from './dto/auth-user.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import type { Response } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Get('check-token')
    checkToken(@Req() req: any) {
        const token = req.cookies?.jwt;
        return this.authService.verifyToken(token);
    }

    @Post('login')
    async authUser(@Body() authUserDto: AuthUserDto, @Res({ passthrough: true }) res: Response): Promise<any> {
        return await this.authService.login(authUserDto, res);
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const token = req.cookies?.jwt;
        return this.authService.logout(token, res);
    }

    @UseGuards(AuthGuard)
    @Post('check-password')
    async checkPassword(@Body('email') email: string, @Body('password') password: string) {
        return await this.authService.checkPassword(email, password);
    }

    @Post('generate-link-forgot-password')
    async forgotPassword(@Body() fPDto: ForgotPasswordDto) {
        return await this.authService.generateResetPasswordLink(fPDto);
    }

    @Get('check-token-forgot-password/:token')
    async checkTokenForgotPassword(@Param('token') token: string) {
        return await this.authService.checkToken(token);
    }

    @Patch(':userId')
    async resetPassword(
        @Param('userId') userId: string,
        @Body() resetPassword: ResetPasswordDto,
        @Body('token') token: string
    ) {
        return await this.authService.reset(+userId, resetPassword, token);
    }

}
