// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
    UseGuards
} from '@nestjs/common'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { WebsiteSetupService } from './website-setup.service'

// ** DTO Imports
import { CreateWebsiteSetupDto } from './dto/create-website-setup.dto'
import { UpdateWebsiteSetupDto } from './dto/update-website-setup.dto'

// ** Types Imports

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('Website Setup')
@UseGuards(AccessTokenGuard)
export class WebsiteSetupController {
    constructor(private readonly websiteSetupService: WebsiteSetupService) {}

    @Get()
    @ApiOkResponse()
    getDataList(@Query() params: { slug: string }) {
        return this.websiteSetupService.getWebsiteSetup(params.slug)
    }

    @Patch(':id')
    @ApiNoContentResponse()
    update(
        @Param('id') id: string,
        @Body() updateWebsiteSetupDto: UpdateWebsiteSetupDto,
    ) {
        return this.websiteSetupService.update(+id, updateWebsiteSetupDto)
    }
}

