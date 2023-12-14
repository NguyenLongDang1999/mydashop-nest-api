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

@Module({
    imports: [
        CategoryModule,
        BrandModule,
        AttributeModule,
        ProductModule,
        AuthModule,
        SliderModule,
        FlashDealsModule,
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
                        path: 'flash-sale',
                        module: FlashDealsModule
                    },
                    {
                        path: 'product',
                        module: ProductModule
                    },
                    {
                        path: 'slider',
                        module: SliderModule
                    }
                ]
            }
        ])
    ]
})
export class AdminModule {}
