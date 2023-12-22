import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebsiteSetupService } from './website-setup.service';
import { CreateWebsiteSetupDto } from './dto/create-website-setup.dto';
import { UpdateWebsiteSetupDto } from './dto/update-website-setup.dto';

@Controller('website-setup')
export class WebsiteSetupController {
  constructor(private readonly websiteSetupService: WebsiteSetupService) {}

  @Post()
  create(@Body() createWebsiteSetupDto: CreateWebsiteSetupDto) {
    return this.websiteSetupService.create(createWebsiteSetupDto);
  }

  @Get()
  findAll() {
    return this.websiteSetupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.websiteSetupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebsiteSetupDto: UpdateWebsiteSetupDto) {
    return this.websiteSetupService.update(+id, updateWebsiteSetupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.websiteSetupService.remove(+id);
  }
}
