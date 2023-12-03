// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateCartDto } from './dto/create-cart.dto'
import { UpdateCartDto } from './dto/update-cart.dto'

// ** Prisma Imports
import { PrismaService } from '../../prisma/prisma.service'

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
                        CartItem: {
                            orderBy: {
                                created_at: 'desc'
                            },
                            select: {
                                id: true,
                                quantity: true,
                                Product: {
                                    select: {
                                        id: true,
                                        sku: true,
                                        name: true,
                                        slug: true,
                                        image_uri: true,
                                        category: {
                                            select: {
                                                id: true,
                                                slug: true,
                                                name: true
                                            }
                                        }
                                        // ProductAttribute: {
                                        //     select: {
                                        //         AttributeValues: {
                                        //             select: {
                                        //                 id: true,
                                        //                 value: true,
                                        //                 Attribute: {
                                        //                     select: {
                                        //                         id: true,
                                        //                         name: true
                                        //                     }
                                        //                 }
                                        //             }
                                        //         }
                                        //     }
                                        // }
                                    }
                                }
                            }
                        }
                    }
                })

                return product
            }

            return []
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    // async create(createCartDto: CreateCartDto, user_id: number) {
    //     try {
    //         const { product_id, quantity, attribute_id } = createCartDto

    //         return await this.prisma.$transaction(async (prisma) => {
    //             const attributes = attribute_id ? JSON.parse(attribute_id) : []

    //             const carts = await prisma.carts.upsert({
    //                 where: { user_id },
    //                 update: {},
    //                 create: { user_id },
    //                 select: { id: true }
    //             })

    //             if (!attributes.length) {
    //                 return await prisma.cartItem.upsert({
    //                     where: {
    //                         cart_id_product_id: {
    //                             cart_id: carts.id,
    //                             product_id
    //                         }
    //                     },
    //                     update: { quantity: { increment: quantity } },
    //                     create: { cart_id: carts.id, product_id, quantity },
    //                     select: { id: true }
    //                 })
    //             }

    //             for (const item of attributes) {
    //                 return await prisma.cartItem.upsert({
    //                     where: {
    //                         cart_id_product_id_attribute_id_attribute_value_id: {
    //                             cart_id: carts.id,
    //                             product_id,
    //                             attribute_id: item?.attribute_id,
    //                             attribute_value_id: item?.attribute_value_id
    //                         }
    //                     },
    //                     update: { quantity: { increment: quantity } },
    //                     create: {
    //                         cart_id: carts.id, product_id, quantity,
    //                         attribute_id: item?.attribute_id,
    //                         attribute_value_id: item?.attribute_value_id
    //                     },
    //                     select: { id: true }
    //                 })
    //             }
    //         })
    //     } catch (error) {
    //         throw new InternalServerErrorException()
    //     }
    // }

    // async update(updateCartDto: UpdateCartDto, user_id: number) {
    //     try {
    //         const { product_id, quantity } = updateCartDto

    //         return await this.prisma.$transaction(async (prisma) => {
    //             const carts = await prisma.carts.upsert({
    //                 where: { user_id },
    //                 update: {},
    //                 create: { user_id },
    //                 select: { id: true }
    //             })

    //             return await prisma.cartItem.upsert({
    //                 where: {
    //                     cart_id_product_id: {
    //                         cart_id: carts.id,
    //                         product_id
    //                     }
    //                 },
    //                 update: { quantity: quantity },
    //                 create: { cart_id: carts.id, product_id, quantity },
    //                 select: { id: true }
    //             })
    //         })
    //     } catch (error) {
    //         throw new InternalServerErrorException()
    //     }
    // }

    // async delete(id: number) {
    //     try {
    //         return await this.prisma.cartItem.delete({
    //             where: { id }
    //         })
    //     } catch (error) {
    //         throw new InternalServerErrorException()
    //     }
    // }
}
