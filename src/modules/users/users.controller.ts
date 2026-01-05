import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Get()
    async findAllUsers() {
        return await this.usersService.findAllUsers();
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getUser(@Request() req: any): Promise<any> {
        return await this.usersService.getUser(req.user.userId);
    }

    @Post()
    async createUser(@Body() userDto: CreateUserDto): Promise<any> {
        return await this.usersService.create(userDto);
    }

    @UseGuards(AuthGuard)
    @Patch(':userId')
    updateUser(@Param('userId') userId: string, @Body() updateUser: UpdateUserDto) {
        return this.usersService.update(+userId, updateUser);
    }

    @UseGuards(AuthGuard)
    @Delete(':userId')
    deleteUser(@Param('userId') userId: string) {
        return this.usersService.delete(+userId);
    }

    @Get('picture/profil/:userId')
    getImageProfil(@Param('userId') userId: string) {
        return this.usersService.getImageProfil(userId);
    }
}
