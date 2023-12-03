// ** NestJS Imports
import {
    Controller,
    Get,
    HttpStatus,
    HttpCode,
    Post,
    Body,
    Req,
    Delete,
    Param,
    Patch,
    UseGuards
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** DTO Imports
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'

// ** Service Imports
import { CartService } from './cart.service'

// ** ExpressJS Imports
import { Request } from 'express'

// ** Guards Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('User Cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiOkResponse()
    getDataList() {
        return []
        // return this.cartService.getDataList(+id)
    }

    // @Post()
    // @UseGuards(AccessTokenGuard)
    // @HttpCode(HttpStatus.CREATED)
    // create(
    //     @Req() req: Request,
    //     @Body() createCartDto: CreateCartDto
    // ) {
    //     const userData = JSON.parse(req.cookies['userData'])
    //     return this.cartService.create(createCartDto, userData.id)
    // }

    // @Patch(':id')
    // @UseGuards(AccessTokenGuard)
    // @HttpCode(HttpStatus.NO_CONTENT)
    // update(
    //     @Req() req: Request,
    //     @Body() updateCartDto: UpdateCartDto
    // ) {
    //     const userData = JSON.parse(req.cookies['userData'])
    //     return this.cartService.update(updateCartDto, userData.id)
    // }

    // @Delete(':id')
    // @UseGuards(AccessTokenGuard)
    // @HttpCode(HttpStatus.NO_CONTENT)
    // delete(@Param('id') id: string) {
    //     return this.cartService.delete(+id)
    // }
}
