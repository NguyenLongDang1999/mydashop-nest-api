// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto'
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IFlashSaleSearch } from './flash-sale.interface'

@Injectable()
export class FlashSaleService {
    constructor(private prisma: PrismaService) {}

    async create(createFlashSaleDto: CreateFlashSaleDto) {
        try {
            const { product_id, ...productData } = createFlashSaleDto

            return await this.prisma.$transaction(async (prisma) => {
                const data = await prisma.flashSale.create({
                    data: {
                        ...productData,
                        FlashSaleProduct: {
                            createMany: {
                                data: product_id.map((productItem) => ({
                                    product_id: productItem
                                })),
                                skipDuplicates: true
                            }
                        }
                    },
                    select: {
                        id: true,
                        discount: true
                    }
                })

                for (const productId of product_id) {
                    const productPrice = await prisma.productPrice.findFirst({
                        where: { product_id: productId },
                        select: { price: true }
                    })

                    if (productPrice) {
                        await prisma.productPrice.update({
                            where: { product_id: productId },
                            data: {
                                discount: data.discount,
                                selling_price: Number(productPrice.price) - ((Number(productPrice.price) / 100) * data.discount)
                            }
                        })
                    }
                }

                return data
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: IFlashSaleSearch) {
        try {
            const { campaign_name, product_id, pageSize, page } = query
            const take = Number(pageSize) || undefined
            const skip = Number(page) || undefined

            const search: Prisma.FlashSaleWhereInput = {
                campaign_name: { contains: campaign_name || undefined, mode: 'insensitive' },
                FlashSaleProduct: {
                    every: { product_id: product_id || undefined }
                }
            }

            const [data, count] = await Promise.all([
                this.prisma.flashSale.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        campaign_name: true,
                        start_date: true,
                        end_date: true,
                        discount: true,
                        FlashSaleProduct: {
                            select: {
                                product_id: true
                            }
                        }
                    }
                }),
                this.prisma.flashSale.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateFlashSaleDto: UpdateFlashSaleDto) {
        try {
            const { product_id, ...productData } = updateFlashSaleDto

            return await this.prisma.$transaction(async (prisma) => {
                const data = await prisma.flashSale.update({
                    data: {
                        ...productData,
                        FlashSaleProduct: {
                            deleteMany: {},
                            createMany: {
                                data: product_id.map((productItem) => ({
                                    product_id: productItem
                                })),
                                skipDuplicates: true
                            }
                        }
                    },
                    where: { id },
                    select: {
                        id: true,
                        discount: true
                    }
                })

                for (const productId of product_id) {
                    const productPrice = await prisma.productPrice.findFirst({
                        where: { product_id: productId },
                        select: { price: true }
                    })

                    if (productPrice) {
                        await prisma.productPrice.update({
                            where: { product_id: productId },
                            data: {
                                discount: data.discount,
                                selling_price: Number(productPrice.price) - ((Number(productPrice.price) / 100) * data.discount)
                            }
                        })
                    }
                }

                return data
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.flashSale.delete({
                where: { id }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
