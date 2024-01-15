// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { ApplyCouponDto } from './dto/apply-coupon-dto'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { PRODUCT_TYPE, SPECIAL_PRICE } from 'src/utils/enums'

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getDataList(user_id: number) {
        try {
            if (user_id) {
                const product = await this.prisma.carts.findFirst({
                    where: { user_id },
                    select: {
                        id: true,
                        discount: true,
                        coupon_code: true,
                        CartItem: {
                            orderBy: {
                                created_at: 'desc'
                            },
                            select: {
                                id: true,
                                quantity: true,
                                attributes: true,
                                Product: {
                                    select: {
                                        id: true,
                                        sku: true,
                                        name: true,
                                        slug: true,
                                        image_uri: true,
                                        product_type: true,
                                        category: {
                                            select: {
                                                id: true,
                                                slug: true,
                                                name: true
                                            }
                                        },
                                        productVariantPrice: {
                                            select: {
                                                price: true,
                                                special_price: true,
                                                special_price_type: true,
                                                discount_start_date: true,
                                                discount_end_date: true,
                                                discount_type: true,
                                                discount_amount: true
                                            }
                                        },
                                        productVariant: {
                                            orderBy: { created_at: 'desc' },
                                            select: {
                                                label: true,
                                                productVariantPrice: {
                                                    select: {
                                                        price: true,
                                                        special_price: true,
                                                        special_price_type: true,
                                                        discount_start_date: true,
                                                        discount_end_date: true,
                                                        discount_type: true,
                                                        discount_amount: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                })

                return {
                    ...product,
                    CartItem: product ? product.CartItem.map(_c => {
                        if (_c.attributes) {
                            const attributes = JSON.parse(_c.attributes)

                            for (const variant of _c.Product.productVariant) {
                                const labelParts = variant.label.split('-').map(item => item.trim()).sort()
                                const valueFind = attributes.map(item2 => item2.attribute_value).sort()

                                if (this.arraysAreEqual(labelParts, valueFind)) {
                                    return {
                                        ..._c,
                                        Product: {
                                            ..._c.Product,
                                            ...variant.productVariantPrice
                                        }
                                    }
                                }
                            }
                        }

                        return {
                            ..._c,
                            Product: {
                                ..._c.Product,
                                ...(_c.Product.product_type === PRODUCT_TYPE.SINGLE
                                    ? _c.Product.productVariantPrice[0]
                                    : _c.Product.productVariant[0]?.productVariantPrice)
                            }
                        }
                    }) : []
                }
            }

            return []
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    arraysAreEqual(productVariant: string[], valuesData: string[]) {
        if (productVariant.length !== valuesData.length) {
            return false
        }

        return productVariant.every((value, index) => value === valuesData[index])
    }

    async create(createCartDto: CreateCartDto, user_id: number) {
        try {
            const { product_id, quantity, attributes } = createCartDto

            return await this.prisma.$transaction(async (prisma) => {
                const carts = await prisma.carts.upsert({
                    where: { user_id },
                    update: {},
                    create: { user_id },
                    select: { id: true }
                })

                return await prisma.cartItem.upsert({
                    where: {
                        cart_id_product_id_attributes: {
                            cart_id: carts.id,
                            product_id,
                            attributes: attributes || ''
                        }
                    },
                    update: { quantity: { increment: quantity } },
                    create: {
                        cart_id: carts.id,
                        product_id,
                        quantity,
                        attributes: attributes || ''
                    },
                    select: { id: true }
                })
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async applyCoupon(applyCouponDto: ApplyCouponDto, user_id: number) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const coupon = await prisma.coupons.findFirst({
                    where: { code: applyCouponDto.coupon_code }
                })

                if (coupon) {
                    if (new Date() >= new Date(coupon.discount_start_date) && new Date() <= new Date(coupon.discount_end_date)) {
                        const couponUsage = await prisma.couponUsages.findFirst({
                            where: { coupon_id: coupon.id, user_id }
                        })

                        if (!couponUsage) {
                            if (applyCouponDto.cart_total >= Number(coupon.min_buy)) {
                                let discount = 0

                                if (coupon.discount_type === SPECIAL_PRICE.PERCENT) {
                                    discount = (applyCouponDto.cart_total / 100) * Number(coupon.discount_amount)
                                }

                                if (coupon.discount_type === SPECIAL_PRICE.PRICE) {
                                    discount = Number(coupon.discount_amount)
                                }

                                const price_total = applyCouponDto.cart_total - discount

                                if (price_total > 0) {
                                    return await prisma.carts.update({
                                        where: { user_id },
                                        data: {
                                            discount: coupon.discount_amount,
                                            coupon_code: coupon.code,
                                            coupon_applied: 10
                                        }
                                    })
                                } else {
                                    console.log('Coupon not applicable!')
                                }
                            } else {
                                console.log('Coupon Price!')
                            }
                        } else {
                            console.log('You already used this coupon!')
                        }
                    } else {
                        console.log('Coupon Expire!')
                    }
                } else {
                    console.log('Invalid Coupon!')
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async removeCoupon(user_id: number) {
        try {
            return this.prisma.carts.update({
                where: { user_id },
                data: {
                    discount: 0,
                    coupon_code: null,
                    coupon_applied: 20
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(updateCartDto: UpdateCartDto, user_id: number) {
        try {
            const { product_id, quantity, attributes } = updateCartDto

            return await this.prisma.$transaction(async (prisma) => {
                const carts = await prisma.carts.upsert({
                    where: { user_id },
                    update: {},
                    create: { user_id },
                    select: { id: true }
                })

                return await prisma.cartItem.upsert({
                    where: {
                        cart_id_product_id_attributes: {
                            cart_id: carts.id,
                            product_id,
                            attributes
                        }
                    },
                    update: { quantity: quantity },
                    create: { cart_id: carts.id, product_id, quantity },
                    select: { id: true }
                })
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async delete(id: number) {
        try {
            return await this.prisma.cartItem.delete({
                where: { id }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async purgeCart(id: number) {
        try {
            return await this.prisma.carts.delete({
                where: { id }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
