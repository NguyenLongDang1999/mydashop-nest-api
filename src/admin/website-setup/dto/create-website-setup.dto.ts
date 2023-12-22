// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateWebsiteSetupDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    slug: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    value: string
}
