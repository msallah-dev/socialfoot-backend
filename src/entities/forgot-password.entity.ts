import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('forgot_password')
export class ForgotPassword {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    token: string;

    @Column()
    expiresAt: Date;

    @ManyToOne(() => User, user => user.forgotPasswords, { onDelete: 'CASCADE' })
    user: User;

    @CreateDateColumn()
    created_at: Date;

}