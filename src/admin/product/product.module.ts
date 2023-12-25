// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { ProductService } from './product.service'

// ** Controller Imports
import { ProductController } from './product.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [ProductService]
})
export class ProductModule {}
