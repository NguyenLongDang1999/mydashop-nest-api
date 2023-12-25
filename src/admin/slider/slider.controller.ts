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
import { SliderService } from './slider.service'

// ** DTO Imports
import { CreateSliderDto } from './dto/create-slider.dto'
import { UpdateSliderDto } from './dto/update-slider.dto'

// ** Types Imports
import { ISliderSearch } from './slider.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Slider')
@UseGuards(AccessTokenGuard)
export class SliderController {
    constructor(private readonly sliderService: SliderService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createSliderDto: CreateSliderDto) {
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
    @ApiNoContentResponse()
    update(
        @Param('id') id: string,
        @Body() updateSliderDto: UpdateSliderDto,
    ) {
        return this.sliderService.update(+id, updateSliderDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.sliderService.remove(+id)
    }
}
