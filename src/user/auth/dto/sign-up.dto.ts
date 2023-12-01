// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail, IsOptional } from 'class-validator'

export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
    name: string

    @IsOptional()
    @IsString()
    @MaxLength(20)
    @ApiProperty()
    phone: string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MaxLength(60)
    @ApiProperty()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @ApiProperty()
    password: string
}
