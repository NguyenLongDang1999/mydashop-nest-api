// ** NestJS Imports
import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

// ** Module Imports
import { CategoryModule } from './category/category.module'
import { BrandModule } from './brand/brand.module'
import { ProductModule } from './product/product.module'
import { AuthModule } from './auth/auth.module'
import { ProductCommentModule } from './product-comment/product-comment.module'
import { CartModule } from './cart/cart.module'
import { WebsiteSetupModule } from './website-setup/website-setup.module'
import { WishlishsModule } from './wishlishs/wishlishs.module'
import { OrdersModule } from './orders/orders.module'

@Module({
    imports: [
        CategoryModule,
        BrandModule,
        ProductModule,
        AuthModule,
        ProductCommentModule,
        CartModule,
        WishlishsModule,
        WebsiteSetupModule,
        OrdersModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
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
                    },
                    {
                        path: 'wishlists',
                        module: WishlishsModule
                    },
                    {
                        path: 'website-setup',
                        module: WebsiteSetupModule
                    },
                    {
                        path: 'orders',
                        module: OrdersModule
                    }
                ]
            }
        ])
    ]
})
export class UserModule {}
