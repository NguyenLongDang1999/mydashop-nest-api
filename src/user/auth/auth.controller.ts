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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { AuthService } from './auth.service'

// ** DTO Imports
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'

// ** ExpressJS Imports
import { Request, Response } from 'express'

// ** Utils Imports
import { AUTH } from 'src/utils/enums'

// ** Guards Imports
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
            .cookie('accessToken', response.accessToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH._1_HOURS
            })
            .cookie('ELRT', response.refreshToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH._7_DAYS
            })
            .json(response.user)
    }

    @Post('sign-up')
    @ApiCreatedResponse()
    async signUp(@Res() res: Response, @Body() data: SignUpDto) {
        const response = await this.authService.signUp(data)

        return (res as Response<any, Record<string, any>>)
            .cookie('accessToken', response.accessToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH._1_HOURS
            })
            .cookie('ELRT', response.refreshToken, {
                httpOnly: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH._7_DAYS
            })
            .json(response.user)
    }

    @Get('sign-out')
    @ApiOkResponse()
    @UseGuards(AccessTokenGuard)
    signOut(@Res() res: Response, @Req() req: Request) {
        try {
            ;(res as Response<any, Record<string, any>>)
                .clearCookie('accessToken', {
                    sameSite: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production'
                })
                .clearCookie('ELRT', {
                    sameSite: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production'
                })
                .send()

            return this.authService.logout(req.user['sub'])
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
