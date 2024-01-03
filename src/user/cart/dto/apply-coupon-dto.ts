// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString } from 'class-validator'

export class ApplyCouponDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    coupon_code: string
}
