// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsOptional, IsArray, ArrayMinSize } from 'class-validator'
import { Transform } from 'class-transformer'

// ** Utils Imports
import { POPULAR, STATUS } from 'src/utils/enums'

export class CreateBrandDto {
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

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
    description?: string

    @IsOptional()
    @ApiProperty({ required: false })
    image_uri?: string

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

    @IsOptional()
    @MaxLength(60)
    @ApiProperty({ required: false })
    meta_title?: string

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
    meta_description?: string
}
