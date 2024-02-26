// ** NestJS Imports
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateOrderDto } from './dto/create-order.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { generateOrderCode } from 'src/utils'
import { MESSAGE_ERROR } from 'src/utils/enums'

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private readonly mailerService: MailerService
    ) {}

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

            // await this.prisma.carts.deleteMany({
            //     where: { id: cart_id }
            // })

            return await this.mailerService.sendMail({
                to: createOrderDto.email,
                subject: 'Testing Nest Mailermodule with template ✔',
                template: './thanks-order'
                // context: {
                //     code,
                //     name: createOrderDto.name,
                //     productData: product_details,
                //     grand_total: createOrderDto.grand_total
                // }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException(MESSAGE_ERROR.CONFLICT)
            }

            throw new InternalServerErrorException()
        }
    }
}
