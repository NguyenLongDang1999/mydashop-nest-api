// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { BrandService } from './brand.service'

// ** Controller Imports
import { BrandController } from './brand.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [BrandController],
    providers: [BrandService]
})
export class BrandModule {}
