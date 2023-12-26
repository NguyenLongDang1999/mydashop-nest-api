// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty } from 'class-validator'

import { CreateWebsiteSetupDto } from './create-website-setup.dto'
import { Transform } from 'class-transformer'

export class BulkWebsiteSetupDto {
    @IsNotEmpty()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value) : undefined))
    @ApiProperty()
    bulkData: CreateWebsiteSetupDto[]
}
