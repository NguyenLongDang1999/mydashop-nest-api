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
import { ProductService } from './product.service'
import { BunnyService } from 'src/bunny/bunny.service'

// ** DTO Imports
import { CreateProductDto } from './dto/create-product.dto'
import { UploadProductDto } from './dto/upload-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

// ** Express Imports
import { Express } from 'express'

// ** Types Imports
import { IProductSearch } from './product.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** Utils Imports
import { PATH } from 'src/utils/enums'
import { fileExtensionURL } from 'src/utils'

@Controller('/')
@ApiTags('Product')
@UseGuards(AccessTokenGuard)
export class ProductController {
    private readonly path = PATH.PRODUCT

    constructor(
        private readonly bunnyService: BunnyService,
        private readonly productService: ProductService,
    ) {}

    @Post()
    @ApiCreatedResponse()
    @UseInterceptors(FileInterceptor('image_uri'))
    async create(@UploadedFile() image_uri: Express.Multer.File, @Body() createProductDto: CreateProductDto) {
        if (image_uri) {
            createProductDto['image_uri'] = fileExtensionURL(image_uri.originalname, createProductDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${createProductDto['image_uri']}`, image_uri.buffer)
        }

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
    @UseInterceptors(FileInterceptor('image_uri'))
    async update(
        @Param('id') id: string,
        @UploadedFile() image_uri: Express.Multer.File,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        if (image_uri) {
            updateProductDto['image_uri'] = fileExtensionURL(image_uri.originalname, updateProductDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${updateProductDto['image_uri']}`, image_uri.buffer)
        }

        return this.productService.update(+id, updateProductDto)
    }

    @Post(':id/upload')
    @ApiNoContentResponse()
    @UseInterceptors(FileInterceptor('image_uri'))
    async createProductUpload(
        @Param('id') id: string,
        @UploadedFile() image_uri: Express.Multer.File,
        @Body() uploadProductDto: UploadProductDto,
    ) {
        const fileName = fileExtensionURL(image_uri.originalname, uploadProductDto['slug'])
        await this.bunnyService.uploadFile(`${this.path}/${fileName}`, image_uri.buffer)

        uploadProductDto['image_uri'] = fileName

        return this.productService.createProductUpload(+id, uploadProductDto)
    }

    @Patch(':id/upload/:image_id')
    @ApiNoContentResponse()
    @UseInterceptors(FileInterceptor('image_uri'))
    async updateProductUpload(
        @Param('image_id') image_id: string,
        @UploadedFile() image_uri: Express.Multer.File,
        @Body() uploadProductDto: UploadProductDto,
    ) {
        const fileName = fileExtensionURL(image_uri.originalname, uploadProductDto['slug'])
        await this.bunnyService.uploadFile(`${this.path}/${fileName}`, image_uri.buffer)

        uploadProductDto['image_uri'] = fileName

        return this.productService.updateProductUpload(+image_id, uploadProductDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.productService.remove(+id)
    }
}
