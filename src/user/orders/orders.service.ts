// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateOrderDto } from './dto/create-order.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { generateOrderCode } from 'src/utils'

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async create(createOrderDto: CreateOrderDto, user_id: number) {
        try {
            const code = generateOrderCode()

            const {
                cart_id,
                product_details,
                ...productData
            } = createOrderDto

            await this.prisma.$transaction(async (prisma) => {
                await prisma.orders.create({
                    data: {
                        ...productData,
                        code,
                        user_id,
                        OrderDetails: {
                            createMany: {
                                data: product_details.map((productItem) => ({
                                    product_id: productItem.id,
                                    quantity: productItem.quantity,
                                    price: productItem.price,
                                    variation: productItem.variation
                                })),
                                skipDuplicates: true
                            }
                        }
                    },
                    select: { id: true }
                })
            })

            return await this.prisma.carts.deleteMany({
                where: { id: cart_id }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }
}
