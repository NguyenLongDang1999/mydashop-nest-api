// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { PagesService } from './pages.service'

// ** Controller Imports
import { PagesController } from './pages.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [PagesController],
    providers: [PagesService]
})
export class PagesModule {}
