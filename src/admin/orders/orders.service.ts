// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IOrdersSearch } from './orders.interface'

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async getTableList(query: IOrdersSearch) {
        try {
            const { code, status, viewed, pageSize, page } = query
            const take = Number(pageSize) || undefined
            const skip = Number(page) || undefined

            const search: Prisma.OrdersWhereInput = {
                deleted_flg: false,
                code: { contains: code || undefined, mode: 'insensitive' },
                status: { equals: Number(status) || undefined },
                viewed: { equals: Number(viewed) || undefined }
            }

            const [data, count] = await Promise.all([
                this.prisma.orders.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        email: true,
                        phone: true,
                        coupon_discount: true,
                        grand_total: true,
                        status: true,
                        viewed: true,
                        _count: {
                            select: {
                                OrderDetails: true
                            }
                        }
                    }
                }),
                this.prisma.orders.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDetail(id: number) {
        try {
            return await this.prisma.orders.findFirst({
                where: { id, deleted_flg: false },
                select: {
                    code: true,
                    date: true,
                    name: true,
                    email: true,
                    phone: true,
                    note: true,
                    shipping_address: true,
                    status: true,
                    grand_total: true,
                    coupon_discount: true,
                    OrderDetails: {
                        select: {
                            price: true,
                            quantity: true,
                            variation: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    image_uri: true,
                                    sku: true,
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
