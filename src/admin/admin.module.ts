// ** NestJS Imports
import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

// ** Module Imports
import { CategoryModule } from './category/category.module'
import { BrandModule } from './brand/brand.module'
import { AttributeModule } from './attribute/attribute.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './auth/auth.module'
import { FlashDealsModule } from './flash-deals/flash-deals.module'
import { CouponModule } from './coupon/coupon.module'
import { WebsiteSetupModule } from './website-setup/website-setup.module'
import { PagesModule } from './pages/pages.module'

@Module({
    imports: [
        CategoryModule,
        BrandModule,
        AttributeModule,
        ProductModule,
        AuthModule,
        FlashDealsModule,
        CouponModule,
        WebsiteSetupModule,
        PagesModule,
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
                        path: 'coupons',
                        module: CouponModule
                    },
                    {
                        path: 'website-setup',
                        module: WebsiteSetupModule
                    },
                    {
                        path: 'pages',
                        module: PagesModule
                    }
                ]
            }
        ])
    ]
})
export class AdminModule {}
