// ** NestJS Imports
import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

// ** Module Imports
import { SliderModule } from './slider/slider.module'
import { CategoryModule } from './category/category.module'
import { BrandModule } from './brand/brand.module'
import { ProductModule } from './product/product.module'

@Module({
    imports: [
        SliderModule,
        CategoryModule,
        BrandModule,
        ProductModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    {
                        path: 'slider',
                        module: SliderModule
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
                        path: 'product',
                        module: ProductModule
                    }
                ]
            }
        ])
    ]
})
export class UserModule {}
