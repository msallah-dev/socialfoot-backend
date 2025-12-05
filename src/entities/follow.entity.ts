import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('Follow')
export class Follow {
    @PrimaryColumn()
    followerId: number;

    @PrimaryColumn()
    followedId: number;

    @ManyToOne(() => User, user => user.following, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followerId' })
    follower: User;

    @ManyToOne(() => User, user => user.followers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'followedId' })
    followed: User;

    @CreateDateColumn()
    followed_at: Date;

}
