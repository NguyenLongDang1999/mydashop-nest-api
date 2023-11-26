// ** NestJS Imports
import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { CategoryService } from './category.service'

@Controller('/')
@ApiTags('User Category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get('data-list')
    @ApiOkResponse()
    getList() {
        return this.categoryService.getList()
    }
}
