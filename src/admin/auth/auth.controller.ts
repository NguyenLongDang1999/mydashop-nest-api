// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    Res,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
    Req,
    ForbiddenException,
    UseGuards
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { AuthService } from './auth.service'

// ** DTO Imports
import { CreateAuthDto } from './dto/create-auth.dto'

// ** ExpressJS Imports
import { Request, Response } from 'express'

// ** Types Imports
import { AuthResponse } from './auth.interface'

// ** Guards Imports
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** Utils Imports
import { AUTH } from 'src/utils/enums'

@Controller('/')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @ApiOkResponse()
    async signIn(@Res() res: Response, @Body() data: CreateAuthDto) {
        try {
            const response: AuthResponse = await this.authService.signIn(data)

            return (res as Response<any, Record<string, any>>)
                .cookie('ELRT', response.refreshToken, {
                    httpOnly: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: AUTH._7_DAYS
                })
                .json({
                    admins: response.admins,
                    accessToken: response.accessToken
                })
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message)
            } else if (error instanceof BadRequestException) {
                throw new BadRequestException(error.message)
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    @Get('sign-out')
    @ApiOkResponse()
    @UseGuards(AccessTokenGuard)
    signOut(@Res() res: Response, @Req() req: Request) {
        try {
            ;(res as Response<any, Record<string, any>>)
                .clearCookie('ELRT', {
                    sameSite: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production'
                })
                .json({ message: 'Success' })

            return this.authService.logout(req.user['sub'])
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    @Get('refresh')
    @ApiOkResponse()
    @UseGuards(RefreshTokenGuard)
    async refreshTokens(@Res() res: Response, @Req() req: Request) {
        try {
            const response: AuthResponse = await this.authService.refreshTokens(req.user['sub'], req.cookies['ELRT'])

            return (res as Response<any, Record<string, any>>)
                .cookie('ELRT', response.refreshToken, {
                    httpOnly: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: AUTH._7_DAYS
                })
                .json({ accessToken: response.accessToken })
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw new ForbiddenException(error.message)
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}
