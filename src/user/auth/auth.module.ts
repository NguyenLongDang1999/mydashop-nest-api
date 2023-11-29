// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { AuthService } from './auth.service'

// ** Controller Imports
import { AuthController } from './auth.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
