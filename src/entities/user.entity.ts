import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Like } from './like.entity';
import { Follow } from './follow.entity';
import { Comment } from './comment.entity';
import { Exclude } from 'class-transformer';
import { ForgotPassword } from './forgot-password.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id_user: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    prenom: string;

    @Exclude()
    @Column()
    password: string;

    @Column()
    age: number;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(() => Like, like => like.user)
    likes: Like[];

    @OneToMany(() => Follow, follow => follow.follower)
    following: Follow[];

    @OneToMany(() => Follow, follow => follow.followed)
    followers: Follow[];

    @OneToMany(() => ForgotPassword, fp => fp.user)
    forgotPasswords: ForgotPassword[]

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
