// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    UseGuards,
    Delete
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { PagesService } from './pages.service'

// ** DTO Imports
import { CreatePageDto } from './dto/create-page.dto'
import { UpdatePageDto } from './dto/update-page.dto'

// ** Types Imports
import { IPagesSearch } from './pages.interface'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Pages')
@UseGuards(AccessTokenGuard)
export class PagesController {
    constructor(private readonly pagesService: PagesService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createPageDto: CreatePageDto) {
        return this.pagesService.create(createPageDto)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: IPagesSearch) {
        return this.pagesService.getTableList({
            ...params,
            page: (params.page - 1) * params.pageSize
        })
    }

    @Get(':id')
    @ApiOkResponse()
    getDetail(@Param('id') id: string) {
        return this.pagesService.getDetail(+id)
    }

    @Patch(':id')
    @ApiNoContentResponse()
    update(
        @Param('id') id: string,
        @Body() updatePageDto: UpdatePageDto,
    ) {
        return this.pagesService.update(+id, updatePageDto)
    }

    @Delete(':id')
    @ApiNoContentResponse()
    delete(@Param('id') id: string) {
        return this.pagesService.delete(+id)
    }
}
