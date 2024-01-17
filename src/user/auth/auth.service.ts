// ** NestJS Imports
import { JwtService } from '@nestjs/jwt'
import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

// ** DTO Imports
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

// ** Argon2 Imports
import argon2 from 'argon2'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { MESSAGE_ERROR } from 'src/utils/enums'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {}

    async signIn(data: SignInDto) {
        const user = await this.prisma.users.findFirst({
            where: {
                email: data.email,
                deleted_flg: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
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
                user: result
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async signUp(data: SignUpDto) {
        try {
            const hashPassword = await this.hashData(data.password)

            await this.prisma.users.create({
                data: {
                    ...data,
                    password: hashPassword
                }
            })

            return await this.signIn({
                email: data.email,
                password: data.password
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException(MESSAGE_ERROR.CONFLICT)
            }

            throw new InternalServerErrorException()
        }
    }

    async logout(userId: number) {
        return await this.prisma.users.update({
            where: { id: userId },
            data: { refresh_token: null }
        })
    }

    hashData(data: string) {
        return argon2.hash(data)
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken)

        await this.prisma.users.update({
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
                    expiresIn: '1h'
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
            const user = await this.prisma.users.findFirst({
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

    async updateProfile(updateProfileDto: UpdateProfileDto, id: number) {
        try {
            return await this.prisma.users.update({
                where: { id },
                data: updateProfileDto,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    image_uri: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
