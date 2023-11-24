// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
    UseGuards
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

// ** Service Imports
import { BrandService } from './brand.service'
import { BunnyService } from 'src/bunny/bunny.service'

// ** DTO Imports
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

// ** Express Imports
import { Express } from 'express'

// ** Types Imports
import { IBrandSearch } from './brand.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** Utils Imports
import { PATH } from 'src/utils/enums'
import { fileExtensionURL } from 'src/utils'

@Controller('/')
@ApiTags('Brand')
@UseGuards(AccessTokenGuard)
export class BrandController {
    private readonly path = PATH.BRAND

    constructor(
        private readonly bunnyService: BunnyService,
        private readonly brandService: BrandService,
    ) {}

    @Post()
    @ApiCreatedResponse()
    @UseInterceptors(FileInterceptor('image_uri'))
    async create(@UploadedFile() image_uri: Express.Multer.File, @Body() createBrandDto: CreateBrandDto) {
        if (image_uri) {
            createBrandDto['image_uri'] = fileExtensionURL(image_uri.originalname, createBrandDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${createBrandDto['image_uri']}`, image_uri.buffer)
        }

        return this.brandService.create(createBrandDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: IBrandSearch) {
        return this.brandService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get('data-list-category/:id')
    @ApiOkResponse()
    getDataListCategory(@Param('id') id: string) {
        return this.brandService.getDataListCategory(+id)
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.brandService.getDetail(+id)
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image_uri'))
    @ApiNoContentResponse()
    async update(
        @Param('id') id: string,
        @UploadedFile() image_uri: Express.Multer.File,
        @Body() updateBrandDto: UpdateBrandDto,
    ) {
        if (image_uri) {
            updateBrandDto['image_uri'] = fileExtensionURL(image_uri.originalname, updateBrandDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${updateBrandDto['image_uri']}`, image_uri.buffer)
        }

        return this.brandService.update(+id, updateBrandDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.brandService.remove(+id)
    }
}
