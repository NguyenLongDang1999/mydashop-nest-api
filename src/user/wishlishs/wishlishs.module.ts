// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { WishlishsService } from './wishlishs.service'

// ** Controller Imports
import { WishlishsController } from './wishlishs.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [WishlishsController],
    providers: [WishlishsService]
})
export class WishlishsModule {}
