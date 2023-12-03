// ** NestJS Imports
import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

// ** Module Imports
import { SliderModule } from './slider/slider.module'
import { CategoryModule } from './category/category.module'
import { BrandModule } from './brand/brand.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './auth/auth.module'
import { ProductCommentModule } from './product-comment/product-comment.module'
import { CartModule } from './cart/cart.module'

@Module({
    imports: [
        SliderModule,
        CategoryModule,
        BrandModule,
        ProductModule,
        AuthModule,
        ProductCommentModule,
        CartModule,
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
                    },
                    {
                        path: 'auth',
                        module: AuthModule
                    },
                    {
                        path: 'product-comment',
                        module: ProductCommentModule
                    },
                    {
                        path: 'cart',
                        module: CartModule
                    }
                ]
            }
        ])
    ]
})
export class UserModule {}
