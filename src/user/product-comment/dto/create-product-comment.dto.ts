import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, IsNumber } from 'class-validator'

export class CreateProductCommentDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    product_id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    user_id: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    rating: number

    @IsNotEmpty()
    @IsString()
    @MaxLength(1000)
    @ApiProperty()
    content: string
}
