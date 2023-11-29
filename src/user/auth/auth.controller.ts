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
import { UpdateAuthDto } from './dto/update-auth.dto'

// ** ExpressJS Imports
import { Request, Response } from 'express'

// ** Utils Imports
import { AUTH } from 'src/utils/enums'

@Controller('/')
@ApiTags('User Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

}
