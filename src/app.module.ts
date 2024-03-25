// ** NestJS Imports
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RouterModule } from '@nestjs/core'

// ** App Imports
import { AppController } from './app.controller'
import { AppService } from './app.service'

// ** Module Imports
import { AdminModule } from './admin/admin.module'
import { UserModule } from './user/user.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AdminModule,
        // UserModule,
        RouterModule.register([
            {
                path: 'admin',
                module: AdminModule
            }
            // {
            //     path: 'user',
            //     module: UserModule
            // }
        ])
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
