// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail } from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateOrderDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    phone?: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    shipping_address?: string

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    coupon_discount?: number

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    note?: string

    // @IsOptional()
    // @IsNumber()
    // @Transform(({ value }) => Number(value))
    // @ApiProperty({ required: false, default: 0 })
    // price = 0
}
