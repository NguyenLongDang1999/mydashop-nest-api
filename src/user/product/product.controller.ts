// ** NestJS Imports
import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { ProductService } from './product.service'

@Controller('/')
@ApiTags('User Product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('data-list')
    @ApiOkResponse()
    getListProductHome() {
        return this.productService.getListProductHome()
    }

    @Get('data-list-search')
    @ApiOkResponse()
    getDataListSearch(@Query() params: { q: string }) {
        return this.productService.getDataListSearch(params)
    }

    @Get('data-list-flash-sale')
    @ApiOkResponse()
    getListProductFlashSale() {
        return this.productService.getListProductFlashSale()
    }

    @Get(':slug')
    @ApiOkResponse()
    getDetail(@Param('slug') slug: string) {
        return this.productService.getDetail(slug)
    }
}
