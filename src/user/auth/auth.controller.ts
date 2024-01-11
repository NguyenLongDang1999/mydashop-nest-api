// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    Res,
    InternalServerErrorException,
    Req,
    ForbiddenException,
    UseGuards
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { AuthService } from './auth.service'

// ** DTO Imports
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

// ** ExpressJS Imports
import { Request, Response } from 'express'

// ** Utils Imports
import { AUTH } from 'src/utils/enums'

// ** Guards Imports
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard'
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('User Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-in')
    @ApiOkResponse()
    async signIn(@Res() res: Response, @Body() data: SignInDto) {
        const response = await this.authService.signIn(data)

        return (res as Response<any, Record<string, any>>)
            .cookie('refreshToken', response.refreshToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH._7_DAYS
            })
            .json({
                user: response.user,
                accessToken: response.accessToken
            })
    }

    @Post('sign-up')
    @ApiCreatedResponse()
    async signUp(@Res() res: Response, @Body() data: SignUpDto) {
        const response = await this.authService.signUp(data)

        return (res as Response<any, Record<string, any>>)
            .cookie('refreshToken', response.refreshToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH._7_DAYS
            })
            .json({ message: 'Success' })
    }

    @Get('sign-out')
    @ApiOkResponse()
    @UseGuards(AccessTokenGuard)
    signOut(@Res() res: Response, @Req() req: Request) {
        try {
            ;(res as Response<any, Record<string, any>>)
                .clearCookie('refreshToken', {
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
            const response = await this.authService.refreshTokens(req.user['sub'], req.cookies['refreshToken'])

            return (res as Response<any, Record<string, any>>)
                .cookie('refreshToken', response.refreshToken, {
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

    @Post('update/profile')
    @UseGuards(AccessTokenGuard)
    @ApiNoContentResponse()
    async updateProfile(@Req() req: Request, @Body() data: UpdateProfileDto) {
        return this.authService.updateProfile(data, req.user['sub'])
    }
}
