// ** NestJS Imports
import { Module } from '@nestjs/common'
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
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST || 'localhost',
                port: parseInt(process.env.SMTP_PORT, 10) || 1025,
                secure: process.env.SMTP_SECURE === 'true',
                ignoreTLS: process.env.SMTP_SECURE !== 'false',
                auth: {
                    user: process.env.SMTP_AUTH_USER,
                    pass: process.env.SMTP_AUTH_PASS
                }
            },
            defaults: {
                from: process.env.SMTP_AUTH_USER
            },
            preview: true,
            template: {
                dir: process.cwd() + '/templates/',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        })
    ],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrdersModule {}
