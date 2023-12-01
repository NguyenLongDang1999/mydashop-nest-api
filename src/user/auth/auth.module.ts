// ** NestJS Imports
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

// ** Service Imports
import { AuthService } from './auth.service'

// ** Controller Imports
import { AuthController } from './auth.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

// ** Strategy Imports
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy'
import { AccessTokenStrategy } from './strategies/accessToken.strategy'

@Module({
    imports: [PrismaModule, PassportModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
