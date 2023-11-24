// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { CategoryService } from './category.service'

// ** Controller Imports
import { CategoryController } from './category.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'
import { BunnyModule } from 'src/bunny/bunny.module'

@Module({
    imports: [PrismaModule, BunnyModule],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {}
