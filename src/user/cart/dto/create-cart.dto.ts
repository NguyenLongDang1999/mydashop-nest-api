// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class CreateCartDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    attribute_id?: number

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    attribute_value_id?: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    product_id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    quantity: number
}
