// ** NestJS Imports
import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** DTO Imports
import { CreateOrderDto } from './dto/create-order.dto'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** ExpressJS Imports
import { Request } from 'express'

// ** Service Imports
import { OrdersService } from './orders.service'

@Controller('/')
@ApiTags('User Orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiCreatedResponse()
    create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
        return this.ordersService.create(createOrderDto, req.user['sub'])
    }
}
