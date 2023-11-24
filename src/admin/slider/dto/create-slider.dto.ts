// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MaxLength,
    IsOptional
} from 'class-validator'
import { Transform } from 'class-transformer'

// ** Utils Imports
import { STATUS } from 'src/utils/enums'

export class CreateSliderDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
        name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
        url: string

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
}
