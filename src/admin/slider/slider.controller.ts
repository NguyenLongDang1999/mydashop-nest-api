// ** NestJS Imports
import { Controller, Get, Post, Body, Patch, Param, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

// ** Service Imports
import { SliderService } from './slider.service'
import { BunnyService } from 'src/bunny/bunny.service'

// ** DTO Imports
import { CreateSliderDto } from './dto/create-slider.dto'
import { UpdateSliderDto } from './dto/update-slider.dto'

// ** Express Imports
import { Express } from 'express'

// ** Types Imports
import { ISliderSearch } from './slider.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** Utils Imports
import { PATH } from 'src/utils/enums'
import { fileExtensionURL } from 'src/utils'

@Controller('/')
@ApiTags('Slider')
@UseGuards(AccessTokenGuard)
export class SliderController {
    private readonly path = PATH.SLIDER

    constructor(
        private readonly bunnyService: BunnyService,
        private readonly sliderService: SliderService,
    ) {}

    @Post()
    @ApiCreatedResponse()
    @UseInterceptors(FileInterceptor('image_uri'))
    async create(@UploadedFile() image_uri: Express.Multer.File, @Body() createSliderDto: CreateSliderDto) {
        if (image_uri) {
            createSliderDto['image_uri'] = fileExtensionURL(image_uri.originalname, createSliderDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${createSliderDto['image_uri']}`, image_uri.buffer)
        }

        return this.sliderService.create(createSliderDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: ISliderSearch) {
        return this.sliderService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image_uri'))
    @ApiNoContentResponse()
    async update(
        @Param('id') id: string,
        @UploadedFile() image_uri: Express.Multer.File,
        @Body() updateSliderDto: UpdateSliderDto,
    ) {
        if (image_uri) {
            updateSliderDto['image_uri'] = fileExtensionURL(image_uri.originalname, updateSliderDto['slug'])
            await this.bunnyService.uploadFile(`${this.path}/${updateSliderDto['image_uri']}`, image_uri.buffer)
        }

        return this.sliderService.update(+id, updateSliderDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.sliderService.remove(+id)
    }
}
