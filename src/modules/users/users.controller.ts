import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Get()
    findAllUsers() {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':email')
    findOneUser(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @Post()
    async createUser(@Body() userDto: CreateUserDto): Promise<any> {
        const user = await this.usersService.create(userDto);

        return { message: 'Utilisateur créé avec succès', data: user };
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

    @UseGuards(AuthGuard)
    @Get('picture/profil/:userId')
    getImageProfil(@Param('userId') userId: string) {
        return this.usersService.getImageProfil(userId);
    }
}
