// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateFileManagerDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    folder_name: string

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ required: false })
    is_folder?: boolean
}
