// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { FlashDealsService } from './flash-deals.service'

// ** Controller Imports
import { FlashDealsController } from './flash-deals.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [FlashDealsController],
    providers: [FlashDealsService]
})
export class FlashDealsModule {}
