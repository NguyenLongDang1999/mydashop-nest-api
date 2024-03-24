// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    UseGuards
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { OrdersService } from './orders.service'

// ** DTO Imports
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

// ** Types Imports
import { IOrdersSearch } from './orders.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Orders')
@UseGuards(AccessTokenGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: IOrdersSearch) {
        return this.ordersService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.ordersService.getDetail(+id)
    }
}
