// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateCouponDto } from './dto/create-coupon.dto'
import { UpdateCouponDto } from './dto/update-coupon.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { ICouponSearch } from './coupon.interface'

@Injectable()
export class CouponService {
    constructor(private prisma: PrismaService) {}

    async create(createCouponDto: CreateCouponDto) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.coupons.create({
                    data: createCouponDto,
                    select: { id: true }
                })
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: ICouponSearch) {
        try {
            const take = Number(query.pageSize) || undefined
            const skip = Number(query.page) || undefined

            const search: Prisma.CouponsWhereInput = {
                code: { contains: query.code || undefined, mode: 'insensitive' }
            }

            const [data, count] = await Promise.all([
                this.prisma.coupons.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        code: true,
                        min_buy: true,
                        discount_start_date: true,
                        discount_end_date: true,
                        discount_type: true,
                        discount_amount: true
                    }
                }),
                this.prisma.coupons.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateCouponDto: UpdateCouponDto) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.coupons.update({
                    where: { id },
                    data: updateCouponDto
                })
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async delete(id: number) {
        try {
            return await this.prisma.coupons.delete({
                where: { id }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
