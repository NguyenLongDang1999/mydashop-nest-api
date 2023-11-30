// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'

// ** Validate Imports
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class UploadProductDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    slug: string

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty()
    index: number

    @IsOptional()
    @ApiProperty()
    image_uri: Express.Multer.File | string
}
