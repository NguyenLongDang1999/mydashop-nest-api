// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsDate, IsArray, IsOptional } from 'class-validator'

// ** Utils Imports
import { SPECIAL_PRICE } from 'src/utils/enums'

export class CreateCouponDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
    code: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    min_buy: number

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

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
    discount_start_date: Date

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ApiProperty()
    discount_end_date: Date
}
