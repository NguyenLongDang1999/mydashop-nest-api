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
    Res
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** DTO Imports
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'

// ** Service Imports
import { CartService } from './cart.service'

// ** ExpressJS Imports
import { Request, Response } from 'express'

// ** Utils Imports
import { generateUUIDv4 } from 'src/utils'
import { AUTH } from 'src/utils/enums'

@Controller('/')
@ApiTags('User Cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiOkResponse()
    getDataList(@Req() req: Request) {
        const sessionId = req.cookies['session_id']

        if (sessionId) {
            return this.cartService.getDataList(sessionId)
        }

        return []
    }

    @Post()
    @ApiCreatedResponse()
    create(
        @Req() req: Request,
        @Res() res: Response,
        @Body() createCartDto: CreateCartDto
    ) {
        const uuidv4 = req.cookies['session_id'] || generateUUIDv4()
        const carts = this.cartService.create(createCartDto, uuidv4)

        return (res as Response<any, Record<string, any>>)
            .cookie('session_id', uuidv4, {
                httpOnly: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
                maxAge: AUTH._30_DAYS
            })
            .json(carts)
    }

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

    @Delete(':id')
    @ApiNoContentResponse()
    delete(@Param('id') id: string) {
        return this.cartService.delete(+id)
    }
}
