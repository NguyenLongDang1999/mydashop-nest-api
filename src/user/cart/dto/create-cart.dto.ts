// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCartDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    attributes?: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    product_id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    quantity: number
}
