// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { BrandService } from './brand.service'

// ** Controller Imports
import { BrandController } from './brand.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'
import { BunnyModule } from 'src/bunny/bunny.module'

@Module({
    imports: [PrismaModule, BunnyModule],
    controllers: [BrandController],
    providers: [BrandService]
})
export class BrandModule {}
