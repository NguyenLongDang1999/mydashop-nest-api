// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    Delete,
    Param,
    Patch,
    Res,
    UseGuards
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** DTO Imports
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { ApplyCouponDto } from './dto/apply-coupon-dto'

// ** Service Imports
import { CartService } from './cart.service'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

// ** ExpressJS Imports
import { Request, Response } from 'express'

// ** Utils Imports
import { AUTH } from 'src/utils/enums'

@Controller('/')
@UseGuards(AccessTokenGuard)
@ApiTags('User Cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get('data-list')
    @ApiOkResponse()
    getDataList(@Req() req: Request) {
        if (req.user['sub']) {
            return this.cartService.getDataList(req.user['sub'])
        }

        return []
    }

    @Post()
    @ApiCreatedResponse()
    create(
        @Req() req: Request,
        @Body() createCartDto: CreateCartDto
    ) {
        return this.cartService.create(createCartDto, req.user['sub'])
    }

    @Post('apply-coupon')
    @ApiNoContentResponse()
    applyCoupon(
        @Req() req: Request,
        @Body() applyCouponDto: ApplyCouponDto
    ) {
        return this.cartService.applyCoupon(applyCouponDto, req.user['sub'])
    }

    @Patch('remove-coupon')
    @ApiNoContentResponse()
    removeCoupon(@Req() req: Request) {
        return this.cartService.removeCoupon(req.user['sub'])
    }

    @Patch()
    @ApiNoContentResponse()
    update(
        @Req() req: Request,
        @Body() updateCartDto: UpdateCartDto
    ) {
        return this.cartService.update(updateCartDto, req.user['sub'])
    }

    @Delete(':id')
    @ApiNoContentResponse()
    delete(@Param('id') id: string) {
        return this.cartService.delete(+id)
    }

    @Delete('purge-cart/:id')
    @ApiNoContentResponse()
    purgeCart(@Param('id') id: string) {
        return this.cartService.purgeCart(+id)
    }
}
