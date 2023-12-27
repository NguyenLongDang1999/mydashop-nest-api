// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateAttributeValuesDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    value: string
}
