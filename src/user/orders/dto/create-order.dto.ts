// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail } from 'class-validator'
import { Transform } from 'class-transformer'

export class ProductDetailsDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    price: number

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    variation?: string
}

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

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    cart_id: number

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    shipping_address?: string

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    coupon_discount?: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    grand_total: number

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    note?: string

    @IsNotEmpty()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value) : undefined))
    @ApiProperty()
    product_details: ProductDetailsDto[]
}
