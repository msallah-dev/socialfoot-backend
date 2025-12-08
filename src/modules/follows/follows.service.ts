import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

        const followedIds = array.map(user => user.followed.id_user);

        const noFolloweds = await this.userRepo.find({
            where: {
                id_user: Not(In([userId, ...followedIds])),
            },
        });

        return noFolloweds;
    }

    async create(followId: number, userId: number) {
        const existing = await this.followsRepo.findOne({
            where: {
                follower: { id_user: userId },
                followed: { id_user: followId }
            }
        });

        if (existing) {
            throw new ConflictException('Tu suis déjà cet utilisateur ');
        }

        const follow = await this.followsRepo.save({
            follower: { id_user: userId } as User,
            followed: { id_user: followId } as User
        });

        return follow;
    }

    async delete(followId: number, userId: number) {
        if (isNaN(followId)) {
            throw new BadRequestException('ID followed invalide');
        }

        const res = await this.followsRepo.delete({
            follower: { id_user: userId } as User,
            followed: { id_user: followId } as User
        });

        if (res.affected === 0) {
            throw new NotFoundException(`Un problème est survenu`);
        }

        return { message: `Vous suivez plus l'utilisateur n°${followId}` };
    }
}
