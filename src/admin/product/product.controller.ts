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
import { ProductService } from './product.service'

// ** DTO Imports
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

// ** Types Imports
import { IProductSearch } from './product.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Product')
@UseGuards(AccessTokenGuard)
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: IProductSearch) {
        return this.productService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get('data-list')
    @ApiOkResponse()
    getDataList(@Query() params: { q: string }) {
        return this.productService.getDataList(params)
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.productService.getDetail(+id)
    }

    @Patch(':id')
    @ApiNoContentResponse()
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(+id, updateProductDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.productService.remove(+id)
    }
}
