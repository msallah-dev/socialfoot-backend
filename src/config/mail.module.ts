import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    transport: {
                        host: config.get('SMTP_HOST'),
                        port: config.get('SMTP_PORT'),
                        secure: false,
                        auth: {
                            user: config.get('EMAIL'),
                            pass: config.get('PASSWORD')
                        },
                    },

                    defaults: {
                        from: `SocialFoot ${config.get('EMAIL')}`,
                    },
                    tls: {
                        rejectUnauthorized: false
                    },
                };
            }
        })
    ]
})

export class MailModule { }