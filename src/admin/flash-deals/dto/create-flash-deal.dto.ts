// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsDate, IsArray, ArrayMinSize } from 'class-validator'

// ** Utils Imports
import { SPECIAL_PRICE } from 'src/utils/enums'

export class flashDealsProductDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty()
    id: number

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ default: SPECIAL_PRICE.PRICE })
    discount_type = SPECIAL_PRICE.PRICE

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ default: 0 })
    discount_amount = 0
}

export class CreateFlashDealDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
    campaign_name: string

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

    @IsArray()
    @ApiProperty()
    flashDealsProduct: flashDealsProductDto[]
}
