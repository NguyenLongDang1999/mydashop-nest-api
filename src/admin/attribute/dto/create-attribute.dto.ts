// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsOptional, IsArray, ArrayMinSize } from 'class-validator'
import { Transform } from 'class-transformer'

// ** Utils Imports
import { STATUS } from 'src/utils/enums'

export class CreateAttributeDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
    name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    slug: string

    @IsArray()
    @Transform(({ value }) => JSON.parse(value).map(Number))
    @ArrayMinSize(1)
    @ApiProperty({ type: [Number] })
    category_id: number[]

    @IsArray()
    @Transform(({ value }) => JSON.parse(value).map(String))
    @ArrayMinSize(1)
    @ApiProperty({ type: [String] })
    attribute_value_id: string[]

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
    description?: string

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: STATUS.INACTIVE })
    status = STATUS.INACTIVE
}
