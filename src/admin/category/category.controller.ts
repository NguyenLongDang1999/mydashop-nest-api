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
import { CategoryService } from './category.service'

// ** DTO Imports
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

// ** Types Imports
import { ICategorySearch } from './category.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Category')
@UseGuards(AccessTokenGuard)
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
    ) {}

    @Post()
    @ApiCreatedResponse()
    async create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: ICategorySearch) {
        return this.categoryService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get('data-list')
    @ApiOkResponse()
    getDataList() {
        return this.categoryService.getDataList()
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.categoryService.getDetail(+id)
    }

    @Patch(':id')
    @ApiNoContentResponse()
    async update(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(+id, updateCategoryDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.categoryService.remove(+id)
    }
}
