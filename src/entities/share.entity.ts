import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";


@Entity('shares')
export class Share {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    postId: number;

    @ManyToOne(() => Post, post => post.shares, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;

    @ManyToOne(() => User, user => user.shares, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

}
