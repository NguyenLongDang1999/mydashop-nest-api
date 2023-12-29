// ** NestJS Imports
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Param,
    Query
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { ProductCommentService } from './product-comment.service'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** DTO Imports
import { CreateProductCommentDto } from './dto/create-product-comment.dto'

// ** Types Imports
import { Pagination } from 'src/user/types/core.type'

@Controller('/')
@ApiTags('User Product Comment')
export class ProductCommentController {
    constructor(private readonly productCommentService: ProductCommentService) {}

    @Post()
    @UseGuards(AccessTokenGuard)
    @ApiCreatedResponse()
    async create(@Body() createProductCommentDto: CreateProductCommentDto) {
        return this.productCommentService.create(createProductCommentDto)
    }

    @Get(':id')
    @ApiOkResponse()
    async getList(@Param('id') id: string, @Query() params?: Pagination) {
        const page = Number(params.page) || 1
        const pageSize = Number(params.pageSize) || 8

        return this.productCommentService.getList(+id, {
            ...params,
            pageSize,
            page: (page - 1) * pageSize || 0
        })
    }
}
