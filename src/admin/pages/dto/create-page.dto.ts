// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

// ** Utils Imports
import { STATUS } from 'src/utils/enums'

export class CreatePageDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    slug: string

    @IsNotEmpty()
    @ApiProperty()
    content: string

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: STATUS.INACTIVE })
    status = STATUS.INACTIVE

    @IsOptional()
    @MaxLength(60)
    @ApiProperty({ required: false })
    meta_title?: string

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
    meta_description?: string
}
