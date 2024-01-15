// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateWishlishDto } from './dto/create-wishlish.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { PRODUCT_TYPE, STATUS } from 'src/utils/enums'

// ** Types Imports
import { Pagination } from '../types/core.type'

@Injectable()
export class WishlishsService {
    constructor(private prisma: PrismaService) {}

    async create(createWishlishDto: CreateWishlishDto, user_id: number) {
        try {
            return await this.prisma.wishlists.create({
                data: {
                    user_id,
                    product_id: createWishlishDto.product_id
                },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getList(user_id: number) {
        try {
            const data = await this.prisma.wishlists.findMany({
                take: 10,
                orderBy: { created_at: 'desc' },
                where: {
                    user_id,
                    product: {
                        deleted_flg: false,
                        status: STATUS.ACTIVE
                    }
                },
                select: {
                    id: true,
                    product: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            slug: true,
                            image_uri: true,
                            total_rating: true,
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
                                    in_stock: true,
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
                                take: 1,
                                orderBy: { created_at: 'desc' },
                                where: { is_default: true },
                                select: {
                                    productVariantPrice: {
                                        select: {
                                            in_stock: true,
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
            })

            const formattedData = data.map((item) => {
                return {
                    ...item,
                    product: {
                        ...item.product,
                        ...(item.product.product_type === PRODUCT_TYPE.SINGLE
                            ? item.product.productVariantPrice[0]
                            : item.product.productVariant[0]?.productVariantPrice)
                    }
                }
            })

            return formattedData
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: Pagination, user_id: number) {
        try {
            const take = Number(query.pageSize) || undefined
            const skip = Number(query.page) || undefined

            const search: Prisma.WishlistsWhereInput = {
                user_id,
                product: {
                    deleted_flg: false
                }
            }

            const [data, count] = await Promise.all([
                this.prisma.wishlists.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        product: {
                            select: {
                                id: true,
                                sku: true,
                                name: true,
                                slug: true,
                                image_uri: true,
                                total_rating: true,
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
                                        in_stock: true,
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
                                    take: 1,
                                    orderBy: { created_at: 'desc' },
                                    where: { is_default: true },
                                    select: {
                                        productVariantPrice: {
                                            select: {
                                                in_stock: true,
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
                }),
                this.prisma.wishlists.count({ where: search })
            ])

            const formattedData = data.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    ...(item.product.product_type === PRODUCT_TYPE.SINGLE
                        ? item.product.productVariantPrice[0]
                        : item.product.productVariant[0]?.productVariantPrice)
                }
            }))

            return { data: formattedData, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async delete(id: number) {
        try {
            return await this.prisma.wishlists.delete({
                where: { id }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
