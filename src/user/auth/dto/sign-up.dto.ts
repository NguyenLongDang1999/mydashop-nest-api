// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail, IsOptional } from 'class-validator'

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty()
    phone: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty()
    password: string
}
