// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { ProductCommentService } from './product-comment.service'

// ** Controller Imports
import { ProductCommentController } from './product-comment.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [ProductCommentController],
    providers: [ProductCommentService]
})
export class ProductCommentModule {}
