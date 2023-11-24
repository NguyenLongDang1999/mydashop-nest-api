// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { BunnyService } from './bunny.service'

@Module({
    providers: [BunnyService],
    exports: [BunnyService]
})
export class BunnyModule {}
