// ** NestJS Imports
import { Controller, Get, Param } from '@nestjs/common'
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

    @Get(':slug')
    @ApiOkResponse()
    getDetail(@Param('slug') slug: string) {
        return this.productService.getDetail(slug)
    }
}
