// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { FlashSaleService } from './flash-sale.service'

// ** Controller Imports
import { FlashSaleController } from './flash-sale.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [FlashSaleController],
    providers: [FlashSaleService]
})
export class FlashSaleModule {}
