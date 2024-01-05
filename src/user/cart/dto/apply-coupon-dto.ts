// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class ApplyCouponDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    cart_total: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    coupon_code: string
}
