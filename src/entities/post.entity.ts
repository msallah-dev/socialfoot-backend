import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";


@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id_post: number;

    @Column({ type: 'text', nullable: false })
    content: string;

    @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @OneToMany(() => Like, like => like.post)
    likes: Like[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
