// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { ProductService } from './product.service'

// ** Controller Imports
import { ProductController } from './product.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'
import { BunnyModule } from 'src/bunny/bunny.module'

@Module({
    imports: [PrismaModule, BunnyModule],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule {}
