// ** NestJS Imports
import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { FlashSaleService } from './flash-sale.service'

// ** DTO Imports
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto'
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto'

// ** Types Imports
import { IFlashSaleSearch } from './flash-sale.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Flash Sale')
@UseGuards(AccessTokenGuard)
export class FlashSaleController {
    constructor(private readonly flashSaleService: FlashSaleService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createFlashSaleDto: CreateFlashSaleDto) {
        return this.flashSaleService.create(createFlashSaleDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params?: IFlashSaleSearch) {
        return this.flashSaleService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.flashSaleService.getDetail(+id)
    }

    @Patch(':id')
    @ApiNoContentResponse()
    update(@Param('id') id: string, @Body() updateFlashSaleDto: UpdateFlashSaleDto) {
        return this.flashSaleService.update(+id, updateFlashSaleDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.flashSaleService.remove(+id)
    }
}
