// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IProductSearch } from './category.interface'

// ** Utils Imports
import { POPULAR, STATUS } from 'src/utils/enums'
import { getNormalizedList, getProductOrderBy } from 'src/utils'

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async getList() {
        try {
            return await this.prisma.category.findMany({
                orderBy: { created_at: 'desc' },
                take: 8,
                where: {
                    parent_id: null,
                    deleted_flg: false,
                    status: STATUS.ACTIVE,
                    popular: POPULAR.ACTIVE
                },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    image_uri: true,
                    children: {
                        take: 4,
                        where: {
                            deleted_flg: false,
                            status: STATUS.ACTIVE,
                            popular: POPULAR.ACTIVE
                        },
                        select: {
                            id: true,
                            slug: true,
                            name: true,
                            image_uri: true
                        }
                    }
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getNestedList() {
        try {
            const categoryList = await this.prisma.category.findMany({
                orderBy: { created_at: 'desc' },
                where: {
                    parent_id: null,
                    deleted_flg: false,
                    status: STATUS.ACTIVE
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    image_uri: true,
                    parent_id: true
                }
            })

            const categoryNested = []

            for (const category of categoryList) {
                const children = await this.renderTree(category.id, 1)

                const categoryWithChildren = {
                    ...category,
                    children
                }

                categoryNested.push(categoryWithChildren)
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
                deleted_flg: false,
                status: STATUS.ACTIVE
            },
            select: {
                id: true,
                name: true,
                slug: true,
                image_uri: true,
                parent_id: true
            }
        })

        const categoryNested = []

        for (const category of categories) {
            const children = await this.renderTree(category.id, level + 1)

            const categoryWithChildren = {
                ...category,
                children
            }

            categoryNested.push(categoryWithChildren)
        }

        return categoryNested
    }

    async getDetail(slug: string, query?: IProductSearch) {
        try {
            const data = await this.prisma.category.findFirstOrThrow({
                where: {
                    slug,
                    deleted_flg: false,
                    status: STATUS.ACTIVE
                },
                select: {
                    id: true,
                    name: true,
                    image_uri: true,
                    description: true,
                    meta_title: true,
                    meta_description: true,
                    category_brand: {
                        where: {
                            brand: {
                                deleted_flg: false,
                                status: STATUS.ACTIVE
                            }
                        },
                        select: {
                            brand: true
                        }
                    },
                    category_attribute: {
                        where: {
                            attribute: {
                                deleted_flg: false,
                                status: STATUS.ACTIVE
                            }
                        },
                        select: {
                            attribute: {
                                include: {
                                    attributeValues: true
                                }
                            }
                        }
                    }
                }
            })

            const { data: product, aggregations } = await this.getListProductShop(query, data.id)

            return {
                ...data,
                aggregations,
                Product: product,
                brands: data.category_brand.map((_item) => _item.brand),
                attributes: data.category_attribute.map((_item) => ({
                    id: _item.attribute.id,
                    name: _item.attribute.name,
                    attribute_values: _item.attribute.attributeValues.map((_values) => ({
                        id: _values.id,
                        value: _values.value
                    }))
                }))
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getListShop(query?: IProductSearch) {
        try {
            return await this.getListProductShop(query)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getListProductShop(query?: IProductSearch, categoryId?: number) {
        const allCategories = await this.getAllSubcategories(categoryId)

        const search: Prisma.ProductWhereInput = {
            deleted_flg: false,
            status: STATUS.ACTIVE,
            brand_id: { in: getNormalizedList(query.brand) },
            category: {
                id: { in: categoryId ? allCategories.map((_v) => _v.id) : undefined },
                deleted_flg: false,
                status: STATUS.ACTIVE
            },
            ...(query.attribute && {
                productAttributes: {
                    some: {
                        productAttributeValues: {
                            some: {
                                attribute_value_id: { in: getNormalizedList(query.attribute) }
                            }
                        }
                    }
                }
            })
        }

        const data = await this.prisma.product.findMany({
            take: query.pageSize,
            skip: query.page,
            orderBy: getProductOrderBy(query.sort),
            where: search,
            select: {
                id: true,
                sku: true,
                name: true,
                slug: true,
                image_uri: true,
                // price: true,
                in_stock: true,
                // special_price: true,
                // selling_price: true,
                short_description: true,
                // special_price_type: true,
                total_rating: true,
                productAttributes: true,
                category: {
                    select: {
                        id: true,
                        slug: true,
                        name: true
                    }
                },
                brand: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return {
            data,
            aggregations: await this.prisma.product.count({ where: search })
        }
    }

    async getAllSubcategories(categoryId: number): Promise<{ id: number; name: string }[]> {
        const subcategoryIds: { id: number; name: string }[] = await this.prisma.$queryRaw`
            WITH RECURSIVE CategoryHierarchy AS (
                SELECT id, parent_id
                FROM "Category"
                WHERE id = ${categoryId} AND deleted_flg = false AND status = ${STATUS.ACTIVE}
                UNION ALL
                SELECT c.id, c.parent_id
                FROM "Category" c
                JOIN CategoryHierarchy ch ON c.parent_id = ch.id
                WHERE c.deleted_flg = false AND c.status = ${STATUS.ACTIVE}
            )
            SELECT id FROM CategoryHierarchy
        `

        return subcategoryIds
    }
}
