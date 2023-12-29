import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateWishlishDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    product_id: number
}
