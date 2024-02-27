// ** NestJS Imports
import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

// ** Service Imports
import { FileManagerService } from './file-manager.service'

// ** Controller Imports
import { FileManagerController } from './file-manager.controller'

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5
        })
    ],
    controllers: [FileManagerController],
    providers: [FileManagerService]
})
export class FileManagerModule {}
