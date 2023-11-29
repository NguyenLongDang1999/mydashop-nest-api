// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IProductSearch } from './product.interface'

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const {
                attributes,
                cross_sell_products,
                upsell_products,
                related_products,
                price,
                special_price,
                selling_price,
                special_price_type,
                ...productData
            } = createProductDto

            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.product.create({
                    data: {
                        ...productData,
                        productPrice: {
                            create: {
                                price,
                                special_price,
                                selling_price,
                                special_price_type
                            }
                        },
                        productAttributes: {
                            create:
                                attributes &&
                                attributes.map((attributeItem) => ({
                                    attribute: {
                                        connect: { id: attributeItem.id }
                                    },
                                    productAttributeValues: {
                                        create: attributeItem.attribute_value_id.map((valueId) => ({
                                            attributeValues: {
                                                connect: { id: valueId }
                                            }
                                        }))
                                    }
                                }))
                        },
                        mainRelatedProducts: {
                            createMany: {
                                data: related_products.map((categoryItem) => ({
                                    related_product_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        },
                        mainCrossSellProducts: {
                            createMany: {
                                data: cross_sell_products.map((categoryItem) => ({
                                    cross_sell_product_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        },
                        mainUpsellProducts: {
                            createMany: {
                                data: upsell_products.map((categoryItem) => ({
                                    up_sell_product_id: categoryItem
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
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async getDataList(params: { q: string }) {
        try {
            return await this.prisma.product.findMany({
                orderBy: { created_at: 'desc' },
                where: {
                    deleted_flg: false,
                    OR: [{
                        sku: { contains: params.q || undefined, mode: 'insensitive' }
                    }, {
                        name: { contains: params.q || undefined, mode: 'insensitive' }
                    }]
                },
                select: {
                    id: true,
                    name: true,
                    image_uri: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: IProductSearch) {
        try {
            const take = Number(query.pageSize) || undefined
            const skip = Number(query.page) || undefined

            const search: Prisma.ProductWhereInput = {
                deleted_flg: false,
                sku: { contains: query.sku || undefined, mode: 'insensitive' },
                name: { contains: query.name || undefined, mode: 'insensitive' },
                status: { equals: Number(query.status) || undefined },
                brand_id: { equals: Number(query.brand_id) || undefined },
                category_id: { equals: Number(query.category_id) || undefined },
                popular: { equals: Number(query.popular) || undefined }
            }

            const [data, count] = await Promise.all([
                this.prisma.product.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        sku: true,
                        name: true,
                        status: true,
                        popular: true,
                        image_uri: true,
                        productPrice: {
                            select: {
                                price: true,
                                special_price: true,
                                special_price_type: true,
                                selling_price: true,
                                discount: true
                            }
                        },
                        category: {
                            select: {
                                id: true,
                                name: true,
                                image_uri: true
                            }
                        },
                        brand: {
                            select: {
                                id: true,
                                name: true,
                                image_uri: true
                            }
                        }
                    }
                }),
                this.prisma.product.count({ where: search })
            ])

            const formattedData = data.map((item) => {
                return {
                    ...item,
                    ...item.productPrice
                }
            })

            return { data: formattedData, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDetail(id: number) {
        try {
            const product = await this.prisma.product.findFirstOrThrow({
                where: { id, deleted_flg: false },
                include: {
                    productPrice: {
                        select: {
                            price: true,
                            discount: true,
                            selling_price: true,
                            special_price: true,
                            special_price_type: true
                        }
                    },
                    flashSaleProduct: {
                        select: {
                            flash_sale_id: true
                        }
                    },
                    productAttributes: {
                        select: {
                            attribute: true,
                            productAttributeValues: true
                        }
                    },
                    mainCrossSellProducts: {
                        select: {
                            cross_sell_product_id: true
                        }
                    },
                    mainRelatedProducts: {
                        select: {
                            related_product_id: true
                        }
                    },
                    mainUpsellProducts: {
                        select: {
                            up_sell_product_id: true
                        }
                    }
                }
            })

            const attributes: Record<
                number,
                {
                    values: number[]
                    name: string
                    id: number
                }
            > = {}

            for (const item of product.productAttributes) {
                const attrId = item.attribute.id
                const attrValueName = item.attribute.name
                const attrValueId = item.productAttributeValues.map((value) => value.attribute_value_id)

                if (!attributes[attrId]) {
                    attributes[attrId] = {
                        values: attrValueId,
                        name: attrValueName,
                        id: attrId
                    }
                } else {
                    attributes[attrId].values = [...attributes[attrId].values, ...attrValueId]
                    attributes[attrId].name = attrValueName
                }
            }

            return {
                ...product,
                ...product.productPrice,
                attributes: Object.values(attributes),
                technical_specifications:
                    typeof product.technical_specifications === 'string'
                        ? JSON.parse(product.technical_specifications)
                        : [],
                related_products: product.mainRelatedProducts.map(({ related_product_id }) => related_product_id),
                upsell_products: product.mainUpsellProducts.map(({ up_sell_product_id }) => up_sell_product_id),
                cross_sell_products: product.mainCrossSellProducts.map(
                    ({ cross_sell_product_id }) => cross_sell_product_id,
                )
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        try {
            const {
                attributes,
                cross_sell_products,
                upsell_products,
                related_products,
                price,
                special_price,
                selling_price,
                special_price_type,
                ...productData
            } = updateProductDto

            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.product.update({
                    where: { id },
                    data: {
                        ...productData,
                        productPrice: {
                            update: {
                                price,
                                special_price,
                                selling_price,
                                special_price_type
                            }
                        },
                        productAttributes: {
                            deleteMany: {},
                            create:
                                attributes &&
                                attributes.map((attributeItem) => ({
                                    attribute: {
                                        connect: { id: attributeItem.id }
                                    },
                                    productAttributeValues: {
                                        create: attributeItem.attribute_value_id.map((valueId) => ({
                                            attributeValues: {
                                                connect: { id: valueId }
                                            }
                                        }))
                                    }
                                }))
                        },
                        mainRelatedProducts: {
                            deleteMany: {},
                            createMany: {
                                data:
                                    related_products &&
                                    related_products.map((categoryItem) => ({
                                        related_product_id: categoryItem
                                    })),
                                skipDuplicates: true
                            }
                        },
                        mainCrossSellProducts: {
                            deleteMany: {},
                            createMany: {
                                data:
                                    cross_sell_products &&
                                    cross_sell_products.map((categoryItem) => ({
                                        cross_sell_product_id: categoryItem
                                    })),
                                skipDuplicates: true
                            }
                        },
                        mainUpsellProducts: {
                            deleteMany: {},
                            createMany: {
                                data:
                                    upsell_products &&
                                    upsell_products.map((categoryItem) => ({
                                        up_sell_product_id: categoryItem
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
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.product.update({
                data: { deleted_flg: true },
                where: { id },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
