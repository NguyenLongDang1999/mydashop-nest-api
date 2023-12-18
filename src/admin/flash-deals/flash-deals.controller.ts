// ** NestJS Imports
import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { FlashDealsService } from './flash-deals.service'

// ** DTO Imports
import { CreateFlashDealDto } from './dto/create-flash-deal.dto'
import { UpdateFlashDealDto } from './dto/update-flash-deal.dto'

// ** Types Imports
import { IFlashDealsSearch } from './flash-deals.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Flash Deals')
@UseGuards(AccessTokenGuard)
export class FlashDealsController {
    constructor(private readonly FlashDealsService: FlashDealsService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createFlashDealDto: CreateFlashDealDto) {
        return this.FlashDealsService.create(createFlashDealDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params?: IFlashDealsSearch) {
        return this.FlashDealsService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.FlashDealsService.getDetail(+id)
    }

    @Patch(':id')
    @ApiNoContentResponse()
    update(@Param('id') id: string, @Body() updateFlashDealDto: UpdateFlashDealDto) {
        return this.FlashDealsService.update(+id, updateFlashDealDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.FlashDealsService.remove(+id)
    }
}
