import { PartialType } from '@nestjs/swagger';
import { CreateWishlishDto } from './create-wishlish.dto';

export class UpdateWishlishDto extends PartialType(CreateWishlishDto) {}
