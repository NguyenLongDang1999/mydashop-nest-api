// ** NestJS Imports
import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, Delete } from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { CouponService } from './coupon.service'

// ** DTO Imports
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'

// ** Types Imports
import { ICouponSearch } from './coupon.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Coupon')
@UseGuards(AccessTokenGuard)
export class CouponController {
    constructor(private readonly couponService: CouponService) {}

    @Post()
    @ApiCreatedResponse()
    async create(@Body() createCouponDto: CreateCouponDto) {
        return this.couponService.create(createCouponDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: ICouponSearch) {
        return this.couponService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Patch(':id')
    @ApiNoContentResponse()
    async update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
        return this.couponService.update(+id, updateCouponDto)
    }

    @Delete(':id')
    @ApiNoContentResponse()
    delete(@Param('id') id: string) {
        return this.couponService.delete(+id)
    }
}
