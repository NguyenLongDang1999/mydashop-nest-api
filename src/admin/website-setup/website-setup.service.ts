import { Injectable } from '@nestjs/common';
import { CreateWebsiteSetupDto } from './dto/create-website-setup.dto';
import { UpdateWebsiteSetupDto } from './dto/update-website-setup.dto';

@Injectable()
export class WebsiteSetupService {
  create(createWebsiteSetupDto: CreateWebsiteSetupDto) {
    return 'This action adds a new websiteSetup';
  }

  findAll() {
    return `This action returns all websiteSetup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} websiteSetup`;
  }

  update(id: number, updateWebsiteSetupDto: UpdateWebsiteSetupDto) {
    return `This action updates a #${id} websiteSetup`;
  }

  remove(id: number) {
    return `This action removes a #${id} websiteSetup`;
  }
}
