// ** NestJS Imports
import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { SliderService } from './slider.service'

@Controller('/')
@ApiTags('User Slider')
export class SliderController {
    constructor(private readonly sliderService: SliderService) {}

    @Get('data-list')
    @ApiOkResponse()
    getList() {
        return this.sliderService.getList()
    }
}
