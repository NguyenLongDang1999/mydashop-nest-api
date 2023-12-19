// ** NestJS Imports
import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

// ** Module Imports
import { CategoryModule } from './category/category.module'
import { BrandModule } from './brand/brand.module'
import { AttributeModule } from './attribute/attribute.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './auth/auth.module'
import { SliderModule } from './slider/slider.module'
import { FlashDealsModule } from './flash-deals/flash-deals.module'
import { CouponModule } from './coupon/coupon.module'

@Module({
    imports: [
        CategoryModule,
        BrandModule,
        AttributeModule,
        ProductModule,
        AuthModule,
        SliderModule,
        FlashDealsModule,
        CouponModule,
        RouterModule.register([
            {
                path: 'admin',
                children: [
                    {
                        path: 'auth',
                        module: AuthModule
                    },
                    {
                        path: 'category',
                        module: CategoryModule
                    },
                    {
                        path: 'brand',
                        module: BrandModule
                    },
                    {
                        path: 'attribute',
                        module: AttributeModule
                    },
                    {
                        path: 'flash-deals',
                        module: FlashDealsModule
                    },
                    {
                        path: 'product',
                        module: ProductModule
                    },
                    {
                        path: 'slider',
                        module: SliderModule
                    },
                    {
                        path: 'coupons',
                        module: CouponModule
                    }
                ]
            }
        ])
    ]
})
export class AdminModule {}
