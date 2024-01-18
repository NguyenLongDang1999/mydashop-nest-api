import { Module } from '@nestjs/common'

// ** Service Imports
import { AttributeValuesService } from './attribute-values.service'

// ** Controller Imports
import { AttributeValuesController } from './attribute-values.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [AttributeValuesController],
    providers: [AttributeValuesService]
})
export class AttributeValuesModule {}
