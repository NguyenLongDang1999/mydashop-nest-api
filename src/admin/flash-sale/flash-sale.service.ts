// ** NestJS Imports
import {
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'

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

            const data = await this.prisma.flashSale.create({
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

            const products = await this.prisma.product.findMany({
                where: {
                    id: {
                        in: product_id
                    }
                },
                select: {
                    id: true,
                    selling_price: true
                }
            })

            const productPriceUpdates = products.map((product) => ({
                where: { product_id: product.id },
                data: {
                    discount: data.discount,
                    selling_price: (Number(product.selling_price) / 100) * data.discount
                }
            }))

            await this.prisma.productPrice.updateMany({
                data: productPriceUpdates
            })

            return data
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
        // try {
            const { product_id, ...productData } = updateFlashSaleDto

            const data = await this.prisma.flashSale.update({
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

            const products = await this.prisma.product.findMany({
                where: {
                    id: {
                        in: product_id
                    }
                },
                select: {
                    id: true,
                    selling_price: true
                }
            })

            const productPriceUpdates = products.map((product) => ({
                where: { product_id: product.id },
                data: {
                    discount: data.discount,
                    selling_price: (Number(product.selling_price) / 100) * data.discount
                }
            }))

            await this.prisma.productPrice.updateMany({
                data: productPriceUpdates
            })

            return data
        // } catch (error) {
        //     throw new InternalServerErrorException()
        // }
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
