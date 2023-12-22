import { PartialType } from '@nestjs/swagger';
import { CreateWebsiteSetupDto } from './create-website-setup.dto';

export class UpdateWebsiteSetupDto extends PartialType(CreateWebsiteSetupDto) {}
