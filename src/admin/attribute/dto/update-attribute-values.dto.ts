// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateAttributeValuesDto {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    id?: number

    @IsOptional()
    @IsNumber()
    @ApiProperty({ required: false })
    attribute_id?: number

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    value?: string
}
