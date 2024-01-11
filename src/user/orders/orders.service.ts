// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateOrderDto } from './dto/create-order.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) {}

    async create(createOrderDto: CreateOrderDto, user_id: number) {
        try {
            return await this.prisma.orders.create({
                data: {
                    ...createOrderDto,
                    code: '',
                    user_id
                },
                select: { id: true }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }
}
