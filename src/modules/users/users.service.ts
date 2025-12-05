import { ConflictException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { UserResponseDto } from './dto/response-user.dto';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>) { }

    findAll() {
        return this.usersRepo.find();
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepo.findOneBy({ email });
        if (!user)
            throw new NotFoundException(`Utilisateur avec e-mail ${email} n'existe pas`);

        return user;
    }

    async create(userDto: CreateUserDto): Promise<UserResponseDto> {
        const userHashedPassword = await this.hashPassword(userDto.password);

        const existing = await this.usersRepo.findOne({ where: { email: userDto.email } });
        if (existing) {
            throw new ConflictException('Email déjà utilisé');
        }

        const newUser = this.usersRepo.create({ ...userDto, password: userHashedPassword });
        const user = await this.usersRepo.save(newUser);

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async update(userId: number, updateUser: UpdateUserDto) {
        if (updateUser.email) {
            const existing = await this.usersRepo.findOne({ where: { email: updateUser.email } });
            if (existing && existing.id_user !== userId) {
                throw new ConflictException('Email déjà utilisé');
            }
        }
        
        if (updateUser.password) updateUser.password = await this.hashPassword(updateUser.password); 

        const user = await this.usersRepo.preload({
            id_user: userId,
            ...updateUser
        });

        if (!user) {
            throw new NotFoundException(`Utilisateur avec l'id ${userId} n'existe pas`);
        }

        return await this.usersRepo.save(user);
    }

    async delete(userId: number) {
        const res = await this.usersRepo.delete(userId);

        if (res.affected === 0) {
            throw new NotFoundException(`Utilisateur avec id ${userId} introuvable`);
        }

        return `Utilisateur avec id ${userId} a été supprimé`;
    }

    getImageProfil(userId: string): StreamableFile {
        const filePath = join(process.cwd(), 'public/uploads/profils', `${userId}.jpg`);

        if (!existsSync(filePath)) {
            throw new NotFoundException('Image non trouvée');
        }

        return new StreamableFile(createReadStream(filePath));
    }

    private async hashPassword(password: string): Promise<string> {
        const hashedPassword = await hash(password, 10);

        return hashedPassword;
    }
}
