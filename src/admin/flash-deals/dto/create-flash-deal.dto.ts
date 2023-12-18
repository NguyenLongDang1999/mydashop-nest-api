// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsDate, IsArray, IsOptional } from 'class-validator'

// ** Utils Imports
import { POPULAR, SPECIAL_PRICE, STATUS } from 'src/utils/enums'

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

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: STATUS.INACTIVE })
    status = STATUS.INACTIVE

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: POPULAR.INACTIVE })
    popular = POPULAR.INACTIVE

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
