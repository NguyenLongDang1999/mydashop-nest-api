// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { WebsiteSetupService } from './website-setup.service'

// ** Controller Imports
import { WebsiteSetupController } from './website-setup.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'
import { BunnyModule } from 'src/bunny/bunny.module'

@Module({
    imports: [PrismaModule, BunnyModule],
    controllers: [WebsiteSetupController],
    providers: [WebsiteSetupService]
})
export class WebsiteSetupModule {}
