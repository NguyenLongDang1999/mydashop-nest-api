// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { AttributeService } from './attribute.service'

// ** Controller Imports
import { AttributeController } from './attribute.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [AttributeController],
    providers: [AttributeService]
})
export class AttributeModule {}
