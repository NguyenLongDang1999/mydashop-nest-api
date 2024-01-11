// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { OrdersService } from './orders.service'

// ** Controller Imports
import { OrdersController } from './orders.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [OrdersController],
    providers: [OrdersService]
})
export class OrdersModule {}
