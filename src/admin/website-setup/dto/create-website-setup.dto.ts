// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateWebsiteSetupDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    slug: string

    @IsOptional()
    @ApiProperty({ required: false })
    value?: string
}
