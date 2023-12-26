// ** NestJS Imports
import {
    Controller,
    Get,
    Query
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { WebsiteSetupService } from './website-setup.service'

@Controller('/')
@ApiTags('User Website Setup')
export class WebsiteSetupController {
    constructor(private readonly websiteSetupService: WebsiteSetupService) {}

    @Get()
    @ApiOkResponse()
    getDataList(@Query() params: { slug: string }) {
        return this.websiteSetupService.getWebsiteSetup(params.slug)
    }

    @Get('system')
    @ApiOkResponse()
    getDataListSystem() {
        return this.websiteSetupService.getDataListSystem()
    }
}

