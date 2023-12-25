// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { SliderService } from './slider.service'

// ** Controller Imports
import { SliderController } from './slider.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [SliderController],
    providers: [SliderService]
})
export class SliderModule {}
