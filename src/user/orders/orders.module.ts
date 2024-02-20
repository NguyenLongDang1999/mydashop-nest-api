// ** NestJS Imports
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

// ** Service Imports
import { OrdersService } from './orders.service'

// ** Controller Imports
import { OrdersController } from './orders.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [
        PrismaModule,
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('SMTP_HOST'),
                    port: config.get('SMTP_PORT'),
                    secure: true,
                    auth: {
                        user: config.get('SMTP_AUTH_USER'),
                        pass: config.get('SMTP_AUTH_PASS')
                    }
                },
                defaults: {
                    from: `"No Reply" <${config.get('SMTP_AUTH_USER')}>`
                },
                preview: true,
                template: {
                    dir: __dirname,
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            }),
            inject: [ConfigService]
        })
    ],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrdersModule {}
