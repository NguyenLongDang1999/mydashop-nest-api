// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, MaxLength, IsEmail, IsOptional } from 'class-validator'

export class UpdateProfileDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
    name: string

    @IsOptional()
    @IsString()
    @MaxLength(20)
    @ApiProperty({ required: false })
    phone?: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(60)
    @ApiProperty()
    email: string

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    address?: string
}
