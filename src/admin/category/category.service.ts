// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { ICategorySearch } from './category.interface'

// ** Utils Imports
import { MESSAGE_ERROR } from 'src/utils/enums'

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async create(createCategoryDto: CreateCategoryDto) {
        try {
            return await this.prisma.category.create({
                data: createCategoryDto,
                select: { id: true }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException(MESSAGE_ERROR.CONFLICT)
            }

            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: ICategorySearch) {
        try {
            const { name, status, popular, pageSize, page } = query
            const take = Number(pageSize) || undefined
            const skip = Number(page) || undefined

            const search: Prisma.CategoryWhereInput = {
                deleted_flg: false,
                name: { contains: name || undefined, mode: 'insensitive' },
                parent_id: { equals: Number(query.parent_id) || undefined },
                status: { equals: Number(status) || undefined },
                popular: { equals: Number(popular) || undefined }
            }

            const [data, count] = await Promise.all([
                this.prisma.category.findMany({
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
                        created_at: true,
                        Product: {
                            where: { deleted_flg: false },
                            select: { id: true }
                        },
                        parent: {
                            select: {
                                id: true,
                                name: true,
                                image_uri: true,
                                Product: {
                                    where: { deleted_flg: false },
                                    select: { id: true }
                                }
                            }
                        }
                    }
                }),
                this.prisma.category.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDataList() {
        try {
            const categoryList = await this.prisma.category.findMany({
                orderBy: { created_at: 'desc' },
                where: {
                    parent_id: null,
                    deleted_flg: false
                }
            })

            const categoryNested = []

            for (const category of categoryList) {
                const categories = await this.renderTree(category.id, 1)
                categoryNested.push(category, ...categories)
            }

            return categoryNested
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async renderTree(parentId: number, level: number) {
        const categories = await this.prisma.category.findMany({
            where: {
                parent_id: parentId,
                deleted_flg: false
            }
        })

        const customLevelName = '|--- '.repeat(level)

        let categoryNested = []

        for (const category of categories) {
            const name = customLevelName + category.name
            categoryNested.push({ ...category, name: name })

            const children = await this.renderTree(category.id, level + 1)
            categoryNested = [...categoryNested, ...children]
        }

        return categoryNested
    }

    async getDetail(id: number) {
        try {
            return await this.prisma.category.findFirstOrThrow({
                where: { id, deleted_flg: false },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
                    popular: true,
                    parent_id: true,
                    image_uri: true,
                    description: true,
                    meta_title: true,
                    meta_description: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        try {
            return await this.prisma.category.update({
                data: updateCategoryDto,
                where: { id }
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
            return await this.prisma.category.update({
                data: { deleted_flg: true },
                where: { id },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
