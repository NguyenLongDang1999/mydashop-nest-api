// ** NestJS Imports
import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { CategoryService } from './category.service'

// ** Types Imports
import { IProductSearch } from './category.interface'

@Controller('/')
@ApiTags('User Category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('data-list')
    @ApiOkResponse()
    getList() {
        return this.categoryService.getList()
    }

    @Get('data-list-nested')
    @ApiOkResponse()
    getListNested() {
        return this.categoryService.getNestedList()
    }

    @Get('data-list-shop')
    @ApiOkResponse()
    getListShop(@Query() params?: IProductSearch) {
        const page = Number(params.page) || 1
        const pageSize = Number(params.pageSize) || 12

        return this.categoryService.getListShop({
            ...params,
            pageSize,
            page: (page - 1) * pageSize || 0
        })
    }

    @Get(':slug')
    @ApiOkResponse()
    getDetail(@Param('slug') slug: string, @Query() params?: IProductSearch) {
        const page = Number(params.page) || 1
        const pageSize = Number(params.pageSize) || 12

        return this.categoryService.getDetail(slug, {
            ...params,
            pageSize,
            page: (page - 1) * pageSize || 0
        })
    }
}
