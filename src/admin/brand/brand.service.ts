// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateBrandDto } from './dto/create-brand.dto'
import { UpdateBrandDto } from './dto/update-brand.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IBrandSearch } from './brand.interface'

@Injectable()
export class BrandService {
    constructor(private prisma: PrismaService) {}

    async create(createBrandDto: CreateBrandDto) {
        try {
            const { category_id, ...brandData } = createBrandDto

            return await this.prisma.brand.create({
                data: {
                    ...brandData,
                    categories: {
                        createMany: {
                            data: category_id.map((categoryItem) => ({
                                category_id: categoryItem
                            })),
                            skipDuplicates: true
                        }
                    }
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

    async getTableList(query: IBrandSearch) {
        try {
            const take = Number(query.pageSize) || undefined
            const skip = Number(query.page) || undefined

            const search: Prisma.BrandWhereInput = {
                deleted_flg: false,
                name: { contains: query.name || undefined, mode: 'insensitive' },
                status: { equals: Number(query.status) || undefined },
                popular: { equals: Number(query.popular) || undefined },
                categories: {
                    some: {
                        category_id: { equals: Number(query.category_id) || undefined }
                    }
                }
            }

            const [data, count] = await Promise.all([
                this.prisma.brand.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        popular: true,
                        image_uri: true,
                        categories: {
                            where: {
                                category: { deleted_flg: false }
                            },
                            select: {
                                category: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }),
                this.prisma.brand.count({ where: search })
            ])

            const formattedData = data.map((item) => {
                return {
                    ...item,
                    categories: item.categories.map((categoryItem) => categoryItem.category)
                }
            })

            return { data: formattedData, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDataListCategory(id: number) {
        try {
            const data = await this.prisma.categoryBrand.findMany({
                orderBy: {
                    brand: { created_at: 'desc' }
                },
                where: {
                    category: { deleted_flg: false },
                    brand: { deleted_flg: false },
                    category_id: id
                },
                select: {
                    brand: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            return data.map((_v) => _v.brand)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDetail(id: number) {
        try {
            const brand = await this.prisma.brand.findFirstOrThrow({
                where: { id, deleted_flg: false },
                include: {
                    categories: {
                        select: { category_id: true }
                    }
                }
            })

            const categoryIds = brand.categories.map(({ category_id }) => category_id)
            return { ...brand, category_id: categoryIds, categories: undefined }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateBrandDto: UpdateBrandDto) {
        try {
            const { category_id, ...brandData } = updateBrandDto

            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.brand.update({
                    where: { id },
                    data: {
                        ...brandData,
                        categories: {
                            deleteMany: {},
                            createMany: {
                                data: category_id.map((categoryItem) => ({
                                    category_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        }
                    }
                })
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.brand.update({
                data: { deleted_flg: true },
                where: { id },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
