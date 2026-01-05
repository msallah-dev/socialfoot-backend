import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from 'src/entities/follow.entity';
import { User } from 'src/entities/user.entity';
import { In, Not, Repository } from 'typeorm';

@Injectable()
export class FollowsService {
    constructor(
        @InjectRepository(Follow) private followsRepo: Repository<Follow>,
        @InjectRepository(User) private userRepo: Repository<User>
    ) { }

    async noFolloweds(userId: number) {
        const array = await this.followsRepo.find({
            where: { follower: { id_user: userId } },
            relations: ['followed']
        });

        const followedIds = array.map((user) => user.followed.id_user);

        const noFolloweds = await this.userRepo.find({
            where: {
                id_user: Not(In([userId, ...followedIds])),
            },
        });

        return {
            success: true,
            data: noFolloweds,
            status: HttpStatus.OK
        };
    }

    async create(followedId: number, userId: number) {
        const existing = await this.followsRepo.findOne({
            where: {
                follower: { id_user: userId },
                followed: { id_user: followedId }
            }
        });

        if (existing)
            return {
                success: false,
                error: "Tu suis déjà cet utilisateur",
                status: HttpStatus.CONFLICT
            }

        const follow = await this.followsRepo.save({
            follower: { id_user: userId } as User,
            followed: { id_user: followedId } as User
        });

        const followdWithUser = await this.followsRepo.findOne({
            where: { followedId: followedId },
            relations: ['followed']
        });

        return {
            success: true,
            message: `Vous commencez à suivre l'utilisateur ${followedId}`,
            data: followdWithUser,
            status: HttpStatus.OK
        };
    }

    async delete(followedId: number, userId: number) {
        if (isNaN(followedId)) {
            throw new BadRequestException('ID followed invalide');
        }

        const res = await this.followsRepo.delete({
            follower: { id_user: userId } as User,
            followed: { id_user: followedId } as User
        });

        if (res.affected === 0)
            return {
                success: false,
                error: "Un problème est survenu",
                status: HttpStatus.NOT_FOUND
            }

        return {
            success: true,
            message: `Vous suivez plus l'utilisateur n°${followedId}`,
            data: followedId,
            status: HttpStatus.OK
        };
    }
}
