// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateFlashDealDto } from './dto/create-flash-deal.dto'
import { UpdateFlashDealDto } from './dto/update-flash-deal.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IFlashDealsSearch } from './flash-deals.interface'

// ** Utils Imports
import { PRODUCT_TYPE } from 'src/utils/enums'

@Injectable()
export class FlashDealsService {
    constructor(private prisma: PrismaService) {}

    async create(createFlashDealDto: CreateFlashDealDto) {
        try {
            const { flashDealsProduct, ...productData } = createFlashDealDto

            return await this.prisma.$transaction(async (prisma) => {
                const data = await prisma.flashDeals.create({
                    data: {
                        ...productData,
                        flashDealsProduct: {
                            createMany: {
                                data: flashDealsProduct.map((productItem) => ({
                                    product_id: productItem.id,
                                    discount_type: productItem.discount_type,
                                    discount_amount: productItem.discount_amount
                                })),
                                skipDuplicates: true
                            }
                        }
                    },
                    select: {
                        id: true,
                        flashDealsProduct: true
                    }
                })

                for (const productItem of flashDealsProduct) {
                    await prisma.productVariantPrice.updateMany({
                        where: { product_id: productItem.id },
                        data: {
                            discount_start_date: createFlashDealDto.start_date,
                            discount_end_date: createFlashDealDto.end_date,
                            discount_type: productItem.discount_type,
                            discount_amount: productItem.discount_amount
                        }
                    })
                }

                return data
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: IFlashDealsSearch) {
        try {
            const { campaign_name, product_id, pageSize, page } = query
            const take = Number(pageSize) || undefined
            const skip = Number(page) || undefined

            const search: Prisma.FlashDealsWhereInput = {
                campaign_name: { contains: campaign_name || undefined, mode: 'insensitive' },
                flashDealsProduct: {
                    every: { product_id: product_id || undefined }
                }
            }

            const [data, count] = await Promise.all([
                this.prisma.flashDeals.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        campaign_name: true,
                        start_date: true,
                        end_date: true,
                        status: true,
                        popular: true
                    }
                }),
                this.prisma.flashDeals.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDetail(id: number) {
        try {
            const data = await this.prisma.flashDeals.findFirstOrThrow({
                where: { id },
                select: {
                    id: true,
                    campaign_name: true,
                    start_date: true,
                    end_date: true,
                    status: true,
                    popular: true,
                    flashDealsProduct: {
                        select: {
                            product_id: true,
                            discount_type: true,
                            discount_amount: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    image_uri: true,
                                    product_type: true,
                                    productVariantPrice: {
                                        select: {
                                            price: true,
                                            special_price: true,
                                            special_price_type: true
                                        }
                                    },
                                    productVariant: {
                                        take: 1,
                                        orderBy: { created_at: 'desc' },
                                        where: { is_default: true },
                                        select: {
                                            productVariantPrice: {
                                                select: {
                                                    price: true,
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
                ...data,
                product_id: data.flashDealsProduct.map(_p => ({
                    ..._p,
                    ..._p.product,
                    ...(_p.product.product_type === PRODUCT_TYPE.SINGLE
                        ? _p.product.productVariantPrice[0]
                        : _p.product.productVariant[0]?.productVariantPrice)
                })),
                flashDealsProduct: data.flashDealsProduct.map(_p => ({
                    ..._p,
                    ..._p.product,
                    ...(_p.product.product_type === PRODUCT_TYPE.SINGLE
                        ? _p.product.productVariantPrice[0]
                        : _p.product.productVariant[0]?.productVariantPrice)
                }))
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateFlashDealDto: UpdateFlashDealDto) {
        try {
            const { flashDealsProduct, ...productData } = updateFlashDealDto

            return await this.prisma.$transaction(async (prisma) => {
                const oldFlashSale = await prisma.flashDeals.findFirstOrThrow({
                    where: { id },
                    select: { flashDealsProduct: true }
                })

                for (const productItem of oldFlashSale.flashDealsProduct) {
                    await prisma.productVariantPrice.updateMany({
                        where: { product_id: productItem.product_id },
                        data: {
                            discount_start_date: null,
                            discount_end_date: null,
                            discount_type: null,
                            discount_amount: null
                        }
                    })
                }

                const data = await prisma.flashDeals.update({
                    data: {
                        ...productData,
                        flashDealsProduct: {
                            deleteMany: {},
                            createMany: {
                                data: flashDealsProduct.map((productItem) => ({
                                    product_id: productItem.id,
                                    discount_type: productItem.discount_type,
                                    discount_amount: productItem.discount_amount
                                })),
                                skipDuplicates: true
                            }
                        }
                    },
                    where: { id },
                    select: {
                        id: true,
                        flashDealsProduct: true
                    }
                })

                for (const productItem of flashDealsProduct) {
                    await prisma.productVariantPrice.updateMany({
                        where: { product_id: productItem.id },
                        data: {
                            discount_start_date: updateFlashDealDto.start_date,
                            discount_end_date: updateFlashDealDto.end_date,
                            discount_type: productItem.discount_type,
                            discount_amount: productItem.discount_amount
                        }
                    })
                }

                return data
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const oldFlashSale = await prisma.flashDeals.findFirstOrThrow({
                    where: { id },
                    select: { flashDealsProduct: true }
                })

                for (const productItem of oldFlashSale.flashDealsProduct) {
                    await prisma.productVariantPrice.updateMany({
                        where: { product_id: productItem.product_id },
                        data: {
                            discount_start_date: null,
                            discount_end_date: null,
                            discount_type: null,
                            discount_amount: null
                        }
                    })
                }

                await prisma.flashDeals.delete({
                    where: { id }
                })
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
