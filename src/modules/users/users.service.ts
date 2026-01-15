import { ConflictException, HttpStatus, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'bcrypt';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private usersRepo: Repository<User>) { }

    async findAllUsers() {
        const users = await this.usersRepo.find({
            relations: ['following', 'followers']
        });

        return {
            success: true,
            data: users,
            status: HttpStatus.OK
        };
    }

    async getUser(userId: number) {
        const user = await this.usersRepo.findOne({
            where: { id_user: userId },
            relations: [
                'following.followed',
                'followers.follower',
                'shares.post.user',
                'shares.post.comments.user',
                'shares.post.likes.user',
                'shares.post.shares.user'
            ]
        });

        if (!user) {
            return {
                success: false,
                error: `Utilisateur avec l'id ${userId} introuvable`,
                status: HttpStatus.NOT_FOUND
            };
        }

        return {
            success: true,
            data: user,
            status: HttpStatus.OK
        };
    }

    async create(userDto: CreateUserDto) {
        const userHashedPassword = await this.hashPassword(userDto.password);

        const existing = await this.usersRepo.findOne({ where: { email: userDto.email } });
        if (existing) return {
            success: false,
            errors: { email: "Email déjà utilisé" },
            status: HttpStatus.CONFLICT
        }

        const newUser = this.usersRepo.create({ ...userDto, password: userHashedPassword });
        const user = await this.usersRepo.save(newUser);
        if (!user) {
            return {
                success: false,
                error: 'Problème survenu',
                status: HttpStatus.INTERNAL_SERVER_ERROR
            };
        }

        return {
            success: true,
            data: user,
            status: HttpStatus.OK
        }
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
            return {
                success: false,
                error: `Utilisateur avec l'id ${userId} n'existe pas`,
                status: HttpStatus.NOT_FOUND
            };
        }

        const userUpdate = await this.usersRepo.save(user);
        return {
            success: true,
            data: userUpdate,
            status: HttpStatus.OK
        }
    }

    async delete(userId: number) {
        const res = await this.usersRepo.delete(userId);

        if (res.affected === 0) {
            return {
                success: false,
                error: `Utilisateur avec l'id ${userId} introuvable`,
                status: HttpStatus.NOT_FOUND
            };
        }

        return {
            success: true,
            message: `Utilisateur avec id ${userId} a été supprimé`,
            status: HttpStatus.OK
        };
    }

    getImageProfil(userId: string): StreamableFile | null {
        const filePath = join(process.cwd(), 'public/uploads/profils', `${userId}.jpg`);

        if (!existsSync(filePath)) return null;

        return new StreamableFile(createReadStream(filePath));
    }

    private async hashPassword(password: string): Promise<string> {
        const hashedPassword = await hash(password, 10);

        return hashedPassword;
    }
}
