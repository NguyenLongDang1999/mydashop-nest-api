// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

// ** Validate Imports
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MaxLength,
    IsDate,
    IsArray,
    ArrayMinSize
} from 'class-validator'

export class CreateFlashSaleDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
        campaign_name: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
        discount: number

    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(1)
    @ApiProperty()
        product_id: number[]

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
        start_date: Date

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
        end_date: Date
}
