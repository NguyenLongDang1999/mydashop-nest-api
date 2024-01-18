// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateAttributeValueDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    attribute_id: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    value: string
}
