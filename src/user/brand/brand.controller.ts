// ** NestJS Imports
import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { BrandService } from './brand.service'

@Controller('/')
@ApiTags('User Brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Get('data-list-all')
    @ApiOkResponse()
    getListAll() {
        return this.brandService.getListAll()
    }
}
