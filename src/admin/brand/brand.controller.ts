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
import { BrandService } from './brand.service'

// ** DTO Imports
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

// ** Types Imports
import { IBrandSearch } from './brand.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Brand')
@UseGuards(AccessTokenGuard)
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createBrandDto: CreateBrandDto) {
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
    @ApiNoContentResponse()
    update(
        @Param('id') id: string,
        @Body() updateBrandDto: UpdateBrandDto,
    ) {
        return this.brandService.update(+id, updateBrandDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.brandService.remove(+id)
    }
}
