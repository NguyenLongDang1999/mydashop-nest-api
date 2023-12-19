// ** NestJS Imports
import { Module } from '@nestjs/common'

// ** Service Imports
import { CouponService } from './coupon.service'

// ** Controller Imports
import { CouponController } from './coupon.controller'

// ** Module Imports
import { PrismaModule } from 'src/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [CouponController],
    providers: [CouponService]
})
export class CouponModule {}
