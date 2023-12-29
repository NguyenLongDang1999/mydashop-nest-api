// ** NestJS Imports
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    InternalServerErrorException,
    Get,
    Param,
    Query,
    Delete
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { WishlishsService } from './wishlishs.service'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** ExpressJS Imports
import { Request } from 'express'

// ** DTO Imports
import { CreateWishlishDto } from './dto/create-wishlish.dto'

// ** Types Imports
import { Pagination } from '../types/core.type'

@Controller('/')
@UseGuards(AccessTokenGuard)
@ApiTags('User Product Wishlists')
export class WishlishsController {
    constructor(private readonly wishlishsService: WishlishsService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createWishlishDto: CreateWishlishDto, @Req() req: Request) {
        return this.wishlishsService.create(createWishlishDto, req.user['sub'])
    }

    @Get('/data-list')
    @ApiOkResponse()
    getList(@Req() req: Request) {
        return this.wishlishsService.getList(req.user['sub'])
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: Pagination) {
        return this.wishlishsService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Delete(':id')
    @ApiNoContentResponse()
    delete(@Param('id') id: string) {
        return this.wishlishsService.delete(+id)
    }
}
