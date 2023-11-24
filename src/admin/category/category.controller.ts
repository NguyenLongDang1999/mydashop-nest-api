// ** NestJS Imports
import { Controller, Get, Post, Body, Patch, Param, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

// ** Service Imports
import { CategoryService } from './category.service'
import { BunnyService } from 'src/bunny/bunny.service'

// ** DTO Imports
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

// ** Express Imports
import { Express } from 'express'

// ** Types Imports
import { ICategorySearch } from './category.interface'

// ** Utils Imports
import { PATH } from 'src/utils/enums'
import { fileExtensionURL } from 'src/utils'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Category')
@UseGuards(AccessTokenGuard)
export class CategoryController {
    private readonly path = PATH.CATEGORY

    constructor(
        private readonly bunnyService: BunnyService,
        private readonly categoryService: CategoryService,
    ) {}

    @Post()
    @ApiCreatedResponse()
    @UseInterceptors(FileInterceptor('image_uri'))
    async create(@UploadedFile() image_uri: Express.Multer.File, @Body() createCategoryDto: CreateCategoryDto) {
        if (image_uri) {
            createCategoryDto['image_uri'] = fileExtensionURL(image_uri.originalname, createCategoryDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${createCategoryDto['image_uri']}`, image_uri.buffer)
        }

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
    @UseInterceptors(FileInterceptor('image_uri'))
    @ApiNoContentResponse()
    async update(
        @Param('id') id: string,
        @UploadedFile() image_uri: Express.Multer.File,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        if (image_uri) {
            updateCategoryDto['image_uri'] = fileExtensionURL(image_uri.originalname, updateCategoryDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${updateCategoryDto['image_uri']}`, image_uri.buffer)
        }

        return this.categoryService.update(+id, updateCategoryDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.categoryService.remove(+id)
    }
}
