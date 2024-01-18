// ** NestJS Imports
import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { AttributeValuesService } from './attribute-values.service'

// ** DTO Imports
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto'

// ** Types Imports
import { IAttributeValuesSearch } from './attribute-values.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Attribute Values')
@UseGuards(AccessTokenGuard)
export class AttributeValuesController {
    constructor(private readonly attributeValuesService: AttributeValuesService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
        return this.attributeValuesService.create(createAttributeValueDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: IAttributeValuesSearch) {
        return this.attributeValuesService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Patch(':id')
    @ApiNoContentResponse()
    update(@Param('id') id: string, @Body() updateAttributeValueDto: UpdateAttributeValueDto) {
        return this.attributeValuesService.update(+id, updateAttributeValueDto)
    }

    @Patch('remove/:id')
    @ApiNoContentResponse()
    remove(@Param('id') id: string) {
        return this.attributeValuesService.remove(+id)
    }
}
