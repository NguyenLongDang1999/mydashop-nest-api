// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'

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
                                                selling_price: true,
                                                special_price: true,
                                                special_price_type: true
                                            }
                                        },
                                        productVariant: {
                                            orderBy: { created_at: 'desc' },
                                            select: {
                                                productVariantPrice: {
                                                    select: {
                                                        price: true,
                                                        selling_price: true,
                                                        special_price: true,
                                                        special_price_type: true
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
                    CartItem: product ? product.CartItem.map(_c => ({
                        ..._c,
                        Product: {
                            ..._c.Product,
                            ...(_c.Product.product_type === PRODUCT_TYPE.SINGLE
                                ? _c.Product.productVariantPrice[0]
                                : _c.Product.productVariant[0]?.productVariantPrice)
                        }
                    })) : []
                }
            }

            return []
        } catch (error) {
            throw new InternalServerErrorException()
        }
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
