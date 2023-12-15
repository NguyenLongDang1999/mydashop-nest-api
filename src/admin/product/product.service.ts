// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateProductDto } from './dto/create-product.dto'
import { UploadProductDto } from './dto/upload-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IProductSearch } from './product.interface'

// ** Utils Imports
import { PRODUCT_TYPE } from 'src/utils/enums'

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const {
                attributes,
                variants,
                cross_sell_products,
                upsell_products,
                related_products,
                price,
                special_price,
                selling_price,
                special_price_type,
                quantity,
                in_stock,
                ...productData
            } = createProductDto

            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.product.create({
                    data: {
                        ...productData,
                        productVariantPrice: {
                            create: !variants ? {
                                price,
                                special_price,
                                selling_price,
                                special_price_type,
                                quantity,
                                in_stock
                            } : undefined
                        },
                        productVariant: {
                            create:
                                variants &&
                                variants.map((variantItem) => ({
                                    sku: variantItem.sku,
                                    label: variantItem.label,
                                    is_default: variantItem.is_default,
                                    productVariantPrice: {
                                        create: {
                                            quantity: variantItem.quantity,
                                            in_stock: variantItem.in_stock,
                                            price: variantItem.price,
                                            special_price: variantItem.special_price,
                                            selling_price: variantItem.selling_price,
                                            special_price_type: variantItem.special_price_type
                                        }
                                    }
                                }))
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
                        mainRelatedProducts: related_products
                            ? {
                                  createMany: {
                                      data: related_products.map((categoryItem) => ({
                                          related_product_id: categoryItem
                                      })),
                                      skipDuplicates: true
                                  }
                              }
                            : {},
                        mainCrossSellProducts: cross_sell_products
                            ? {
                                  createMany: {
                                      data: cross_sell_products.map((categoryItem) => ({
                                          cross_sell_product_id: categoryItem
                                      })),
                                      skipDuplicates: true
                                  }
                              }
                            : {},
                        mainUpsellProducts: upsell_products
                            ? {
                                  createMany: {
                                      data: upsell_products.map((categoryItem) => ({
                                          up_sell_product_id: categoryItem
                                      })),
                                      skipDuplicates: true
                                  }
                              }
                            : {}
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

    async createProductUpload(id: number, uploadProductDto: UploadProductDto) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.productImage.create({
                    data: {
                        product_id: id,
                        index: uploadProductDto.index,
                        image_uri: uploadProductDto.image_uri as string
                    },
                    select: { id: true }
                })
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async updateProductUpload(id: number, uploadProductDto: UploadProductDto) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                return await prisma.productImage.update({
                    where: { id },
                    data: {
                        image_uri: uploadProductDto.image_uri as string
                    },
                    select: { id: true }
                })
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDataList(params: { q: string }) {
        try {
            return await this.prisma.product.findMany({
                orderBy: { created_at: 'desc' },
                where: {
                    deleted_flg: false,
                    OR: [
                        {
                            sku: { contains: params.q || undefined, mode: 'insensitive' }
                        },
                        {
                            name: { contains: params.q || undefined, mode: 'insensitive' }
                        }
                    ]
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
                        product_type: true,
                        productVariantPrice: {
                            select: {
                                price: true,
                                special_price: true,
                                special_price_type: true,
                                selling_price: true,
                                discount: true
                            }
                        },
                        productVariant: {
                            take: 1,
                            orderBy: { created_at: 'desc' },
                            where: { is_default: true },
                            select: {
                                productVariantPrice: {
                                    select: {
                                        price: true,
                                        special_price: true,
                                        special_price_type: true,
                                        selling_price: true,
                                        discount: true
                                    }
                                }
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

            const formattedData = data.map((item) => ({
                ...item,
                ...(item.product_type === PRODUCT_TYPE.SINGLE
                    ? item.productVariantPrice[0]
                    : item.productVariant[0]?.productVariantPrice)
            }))

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
                    productVariantPrice: {
                        select: {
                            in_stock: true,
                            quantity: true,
                            price: true,
                            discount: true,
                            selling_price: true,
                            special_price: true,
                            special_price_type: true
                        }
                    },
                    productVariant: {
                        select: {
                            id: true,
                            is_default: true,
                            label: true,
                            sku: true,
                            productVariantPrice: {
                                select: {
                                    in_stock: true,
                                    quantity: true,
                                    price: true,
                                    discount: true,
                                    selling_price: true,
                                    special_price: true,
                                    special_price_type: true
                                }
                            }
                        }
                    },
                    productImage: {
                        orderBy: { index: 'asc' },
                        select: {
                            id: true,
                            image_uri: true
                        }
                    },
                    FlashDealsProduct: {
                        select: {
                            flash_deal_id: true
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
                ...product.productVariantPrice[0],
                variants: product.productVariant.map(_p => ({
                    ..._p,
                    ..._p.productVariantPrice
                })),
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
                variants,
                cross_sell_products,
                upsell_products,
                related_products,
                price,
                special_price,
                selling_price,
                special_price_type,
                quantity,
                in_stock,
                ...productData
            } = updateProductDto

            return await this.prisma.$transaction(async (prisma) => {
                const product = await prisma.product.update({
                    where: { id },
                    data: {
                        ...productData,
                        productVariant: variants
                            ? {
                                deleteMany: {},
                                create:
                                    variants.map((variantItem) => ({
                                        sku: variantItem.sku,
                                        label: variantItem.label,
                                        is_default: variantItem.is_default,
                                        productVariantPrice: {
                                            create: {
                                                product_id: id,
                                                quantity: variantItem.quantity,
                                                in_stock: variantItem.in_stock,
                                                price: variantItem.price,
                                                special_price: variantItem.special_price,
                                                selling_price: variantItem.selling_price,
                                                special_price_type: variantItem.special_price_type
                                            }
                                        }
                                    }))
                        } : {},
                        productAttributes: attributes
                            ? {
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
                              }
                            : {},
                        mainRelatedProducts: related_products
                            ? {
                                  deleteMany: {},
                                  createMany: {
                                      data: related_products.map((categoryItem) => ({
                                          related_product_id: categoryItem
                                      })),
                                      skipDuplicates: true
                                  }
                              }
                            : {},
                        mainCrossSellProducts: cross_sell_products
                            ? {
                                  deleteMany: {},
                                  createMany: {
                                      data: cross_sell_products.map((categoryItem) => ({
                                          cross_sell_product_id: categoryItem
                                      })),
                                      skipDuplicates: true
                                  }
                              }
                            : {},
                        mainUpsellProducts: upsell_products
                            ? {
                                  deleteMany: {},
                                  createMany: {
                                      data: upsell_products.map((categoryItem) => ({
                                          up_sell_product_id: categoryItem
                                      })),
                                      skipDuplicates: true
                                  }
                              }
                            : {}
                    },
                    include: {
                        productVariantPrice: {
                            select: { id: true }
                        }
                    }
                })

                if (!variants) {
                    await prisma.productVariantPrice.update({
                        where: { id: product.productVariantPrice[0].id },
                        data: {
                            price,
                            special_price,
                            selling_price,
                            special_price_type,
                            quantity,
                            in_stock
                        }
                    })
                }

                return product
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
