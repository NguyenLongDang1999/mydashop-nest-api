// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'
import { ApplyCouponDto } from './dto/apply-coupon-dto'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { PRODUCT_TYPE } from 'src/utils/enums'

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getDataList(session_id: string) {
        try {
            if (session_id) {
                const product = await this.prisma.carts.findFirst({
                    where: { session_id },
                    select: {
                        id: true,
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

    async create(createCartDto: CreateCartDto, session_id: string) {
        try {
            const { product_id, quantity, attributes } = createCartDto

            return await this.prisma.$transaction(async (prisma) => {
                const carts = await prisma.carts.upsert({
                    where: { session_id },
                    update: {},
                    create: { session_id },
                    select: { id: true }
                })

                return prisma.cartItem.upsert({
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

    async applyCoupon(applyCouponDto: ApplyCouponDto, session_id: string) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const coupon = prisma.coupons.findFirst({
                    where: { code: applyCouponDto.coupon_code }
                })

                if (coupon) {

                } else {
                    // invalid coupon
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(updateCartDto: UpdateCartDto, session_id: string) {
        try {
            const { product_id, quantity, attributes } = updateCartDto

            return await this.prisma.$transaction(async (prisma) => {
                const carts = await prisma.carts.upsert({
                    where: { session_id },
                    update: {},
                    create: { session_id },
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
