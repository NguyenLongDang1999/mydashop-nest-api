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

// ** Utils Imports
import { SPECIAL_PRICE } from 'src/utils/enums'

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const { attributes, product_cross_sell, product_upsell, product_related, ...productData } = createProductDto

            if (productData['special_price_type']) {
                productData['selling_price'] = this.getSellingPrice(
                    productData['special_price_type'],
                    productData['price'],
                    productData['special_price'],
                )
            }

            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.product.create({
                    data: {
                        ...productData,
                        productAttributes: {
                            create: attributes.map((attributeItem) => ({
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
                                data: product_related.map((categoryItem) => ({
                                    related_product_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        },
                        mainCrossSellProducts: {
                            createMany: {
                                data: product_cross_sell.map((categoryItem) => ({
                                    cross_sell_product_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        },
                        mainUpsellProducts: {
                            createMany: {
                                data: product_upsell.map((categoryItem) => ({
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

    async getDataList() {
        try {
            return await this.prisma.product.findMany({
                orderBy: { created_at: 'desc' },
                where: { deleted_flg: false },
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
                        price: true,
                        special_price: true,
                        special_price_type: true,
                        selling_price: true,
                        created_at: true,
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

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    getSellingPrice(specialPriceType: number, price: number, specialPrice: number) {
        let discount = 0

        if (specialPriceType === SPECIAL_PRICE.PERCENT) {
            discount = (price / 100) * specialPrice
        }

        if (specialPriceType === SPECIAL_PRICE.PRICE) {
            discount = specialPrice
        }

        return price - discount
    }

    async getDetail(id: number) {
        try {
            const product = await this.prisma.product.findFirstOrThrow({
                where: { id, deleted_flg: false },
                include: {
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
            const { attributes, product_cross_sell, product_upsell, product_related, ...productData } = updateProductDto

            const specialPriceType = productData['special_price_type']
            const specialPrice = productData['special_price']
            const price = productData['price']

            if (specialPriceType) {
                productData['selling_price'] = this.getSellingPrice(specialPriceType, price, specialPrice)
            }

            return await this.prisma.$transaction(async (prisma) => {
                await this.prisma.productAttribute.deleteMany({
                    where: { product_id: id }
                })

                return await prisma.product.update({
                    where: { id },
                    data: {
                        ...productData,
                        productAttributes: {
                            deleteMany: {},
                            create: attributes.map((attributeItem) => ({
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
                                data: product_related.map((categoryItem) => ({
                                    related_product_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        },
                        mainCrossSellProducts: {
                            deleteMany: {},
                            createMany: {
                                data: product_cross_sell.map((categoryItem) => ({
                                    cross_sell_product_id: categoryItem
                                })),
                                skipDuplicates: true
                            }
                        },
                        mainUpsellProducts: {
                            deleteMany: {},
                            createMany: {
                                data: product_upsell.map((categoryItem) => ({
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
