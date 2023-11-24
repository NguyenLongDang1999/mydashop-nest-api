// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, MaxLength, MinLength, IsEmail } from 'class-validator'

export class CreateAuthDto {
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
