import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ForgotPassword } from 'src/entities/forgot-password.entity';
import { MailModule } from 'src/config/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ForgotPassword]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
