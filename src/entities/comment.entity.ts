import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";


@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id_commentaire: number;

    @Column()
    content: string;

    @ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
    post: Post;

    @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
