// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateProductCommentDto } from './dto/create-product-comment.dto'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { Pagination } from 'src/user/types/core.type'

@Injectable()
export class ProductCommentService {
    constructor(private prisma: PrismaService) {}

    async updateTotalRating(productId: number) {
        try {
            const productStats = await this.prisma.productComments.groupBy({
                by: ['product_id'],
                where: { product_id: productId },
                _count: { rating: true },
                _sum: { rating: true }
            })

            if (productStats.length > 0) {
                const { _count, _sum } = productStats[0]
                const total_rating = _sum?.rating / _count?.rating || 0

                await this.prisma.product.update({
                    where: { id: productId },
                    data: { total_rating }
                })
            }

            return productStats
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async create(createProductCommentDto: CreateProductCommentDto, user_id: number) {
        try {
            await this.prisma.productComments.create({
                data: {
                    ...createProductCommentDto,
                    user_id
                },
                select: { id: true }
            })

            return await this.updateTotalRating(createProductCommentDto.product_id)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getList(id: number, query?: Pagination) {
        try {
            const data = await this.prisma.productComments.findMany({
                take: query.pageSize,
                skip: query.page,
                orderBy: { created_at: 'desc' },
                where: {
                    product_id: id,
                    deleted_flg: false
                },
                select: {
                    id: true,
                    rating: true,
                    content: true,
                    created_at: true,
                    Users: {
                        select: {
                            id: true,
                            name: true,
                            image_uri: true
                        }
                    }
                }
            })

            const aggregations = await this.prisma.productComments.count({
                where: {
                    product_id: id,
                    deleted_flg: false
                }
            })

            const comments = await this.prisma.productComments.groupBy({
                by: ['rating'],
                where: {
                    product_id: id,
                    deleted_flg: false
                },
                _count: {
                    rating: true
                }
            })

            const totalReviews = comments.reduce((total, item) => total + item._count.rating, 0)
            const ratingStats = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0
            }

            comments.forEach((item) => {
                ratingStats[item.rating] = item._count.rating
            })

            const ratingPercentages = {}
            for (let i = 1; i <= 5; i++) {
                ratingPercentages[i] = {
                    count: ratingStats[i],
                    percent: (ratingStats[i] / totalReviews) * 100 || 0
                }
            }

            return { data, aggregations, totalReviews, ratingStats, ratingPercentages }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
