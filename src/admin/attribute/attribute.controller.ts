// ** NestJS Imports
import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { AttributeService } from './attribute.service'

// ** DTO Imports
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'

// ** Types Imports
import { IAttributeSearch } from './attribute.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Attribute')
@UseGuards(AccessTokenGuard)
export class AttributeController {
    constructor(private readonly attributeService: AttributeService) {}

    @Post()
    @ApiCreatedResponse()
    async create(@Body() createAttributeDto: CreateAttributeDto) {
        return this.attributeService.create(createAttributeDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: IAttributeSearch) {
        return this.attributeService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get('data-list-category/:id')
    @ApiOkResponse()
    getDataListCategory(@Param('id') id: string) {
        return this.attributeService.getDataListCategory(+id)
    }

    @Get('attribute-value-data-list/:id')
    @ApiOkResponse()
    getValueDataList(@Param('id') id: string) {
        return this.attributeService.getValueDataList(+id)
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.attributeService.getDetail(+id)
    }

    @Patch(':id')
    @ApiNoContentResponse()
    async update(@Param('id') id: string, @Body() updateAttributeDto: UpdateAttributeDto) {
        return this.attributeService.update(+id, updateAttributeDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.attributeService.remove(+id)
    }
}
