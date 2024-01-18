// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateAttributeDto } from './dto/create-attribute.dto'
import { UpdateAttributeDto } from './dto/update-attribute.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IAttributeSearch } from './attribute.interface'

// ** Utils Imports
import { MESSAGE_ERROR } from 'src/utils/enums'

@Injectable()
export class AttributeService {
    constructor(private prisma: PrismaService) {}

    async create(createAttributeDto: CreateAttributeDto) {
        try {
            const { category_id, attribute_value_id, ...attributeData } = createAttributeDto

            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.attribute.create({
                    data: {
                        ...attributeData,
                        categories: {
                            createMany: {
                                data: category_id.map((categoryItem) => ({
                                    category_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        },
                        attributeValues: {
                            createMany: {
                                data: attribute_value_id.map((attributeItem) => ({
                                    value: attributeItem
                                })),
                                skipDuplicates: true
                            }
                        }
                    },
                    select: { id: true }
                })
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException(MESSAGE_ERROR.CONFLICT)
            }

            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: IAttributeSearch) {
        try {
            const { name, status, category_id, pageSize, page } = query
            const take = Number(pageSize) || undefined
            const skip = Number(page) || undefined

            const search: Prisma.AttributeWhereInput = {
                deleted_flg: false,
                name: { contains: name || undefined, mode: 'insensitive' },
                status: { equals: Number(status) || undefined },
                categories: {
                    some: {
                        category_id: { equals: Number(category_id) || undefined }
                    }
                }
            }

            const [data, count] = await Promise.all([
                this.prisma.attribute.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        created_at: true,
                        updated_at: true,
                        categories: {
                            where: {
                                category: { deleted_flg: false }
                            },
                            select: { category: true }
                        }
                    }
                }),
                this.prisma.attribute.count({ where: search })
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

    async getDataList() {
        try {
            return await this.prisma.attribute.findMany({
                orderBy: { created_at: 'desc' },
                where: { deleted_flg: false },
                select: {
                    id: true,
                    name: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDataListCategory(id: number) {
        try {
            const data = await this.prisma.categoryAttribute.findMany({
                orderBy: {
                    attribute: { created_at: 'desc' }
                },
                where: {
                    category: { deleted_flg: false },
                    attribute: { deleted_flg: false },
                    category_id: id
                },
                select: {
                    attribute: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            return data.map((_v) => _v.attribute)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getValueDataList(id: number) {
        try {
            const attribute = await this.prisma.attribute.findFirstOrThrow({
                orderBy: { created_at: 'desc' },
                where: { id, deleted_flg: false },
                select: {
                    attributeValues: {
                        select: {
                            id: true,
                            value: true
                        }
                    }
                }
            })

            return attribute.attributeValues.map((_v) => ({
                id: _v.id,
                name: _v.value
            }))
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDetail(id: number) {
        try {
            const attribute = await this.prisma.attribute.findFirstOrThrow({
                where: { id, deleted_flg: false },
                include: {
                    categories: {
                        select: { category_id: true }
                    },
                    attributeValues: {
                        orderBy: { id: 'asc' },
                        select: {
                            id: true,
                            value: true
                        }
                    }
                }
            })

            return {
                ...attribute,
                category_id: attribute.categories.map(({ category_id }) => category_id),
                attribute_value_id: attribute.attributeValues,
                AttributeValues: undefined,
                CategoryAttribute: undefined
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateAttributeDto: UpdateAttributeDto) {
        try {
            const { category_id, ...attributeData } = updateAttributeDto

            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.attribute.update({
                    where: { id },
                    data: {
                        ...attributeData,
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
                throw new ConflictException(MESSAGE_ERROR.CONFLICT)
            }

            throw new InternalServerErrorException()
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.attribute.update({
                data: { deleted_flg: true },
                where: { id },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
