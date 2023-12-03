// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { CartService } from './cart.service'

// ** Controller Imports
import { CartController } from './cart.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [CartController],
    providers: [CartService]
})
export class CartModule {}
