// ** NestJS Imports
import { JwtService } from '@nestjs/jwt'
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// ** DTO Imports
import { CreateAuthDto } from './dto/create-auth.dto'

// ** Argon2 Imports
import argon2 from 'argon2'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {}

    async signIn(data: CreateAuthDto) {
        const user = await this.prisma.admins.findFirst({
            where: {
                email: data.email,
                deleted_flg: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                password: true,
                image_uri: true
            }
        })

        if (!user) throw new NotFoundException()

        const passwordMatches = await argon2.verify(user.password, data.password)

        if (!passwordMatches) throw new BadRequestException()

        try {
            const tokens = await this.getTokens(user.id, user.email)
            await this.updateRefreshToken(user.id, tokens.refreshToken)
            const { password: _, ...result } = user

            return {
                ...tokens,
                admins: result
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async logout(userId: number) {
        return await this.prisma.admins.update({
            where: { id: userId },
            data: { refresh_token: null }
        })
    }

    hashData(data: string) {
        return argon2.hash(data)
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken)

        await this.prisma.admins.update({
            where: { id: userId },
            data: { refresh_token: hashedRefreshToken }
        })
    }

    async getTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m'
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: '7d'
                },
            )
        ])

        return {
            accessToken,
            refreshToken
        }
    }

    async refreshTokens(id: number, refreshToken: string) {
        try {
            const user = await this.prisma.admins.findFirst({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    refresh_token: true
                }
            })

            if (!user || !user.refresh_token) throw new ForbiddenException()

            const refreshTokenMatches = await argon2.verify(user.refresh_token, refreshToken)

            if (!refreshTokenMatches) throw new ForbiddenException()

            const tokens = await this.getTokens(user.id, user.email)
            await this.updateRefreshToken(user.id, tokens.refreshToken)

            return tokens
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
