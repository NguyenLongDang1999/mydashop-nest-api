// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { PRODUCT_TYPE, SHOW_PRODUCT, STATUS } from 'src/utils/enums'

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async getListProductHome() {
        try {
            const data = await this.prisma.category.findMany({
                take: 3,
                orderBy: { created_at: 'desc' },
                where: {
                    deleted_flg: false,
                    status: STATUS.ACTIVE,
                    show_product: SHOW_PRODUCT.SHOW
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    Product: {
                        orderBy: { created_at: 'desc' },
                        where: {
                            deleted_flg: false,
                            status: STATUS.ACTIVE
                        },
                        take: 10,
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            slug: true,
                            image_uri: true,
                            in_stock: true,
                            total_rating: true,
                            productAttributes: true,
                            category: {
                                select: {
                                    id: true,
                                    slug: true,
                                    name: true
                                }
                            }
                            // productPrice: {
                            //     select: {
                            //         price: true,
                            //         selling_price: true,
                            //         special_price: true,
                            //         special_price_type: true
                            //     }
                            // }
                        }
                    }
                }
            })

            const formattedData = data.map((item) => {
                return {
                    ...item,
                    Product: item.Product.map((_p) => ({
                        ..._p
                        // ..._p.productPrice
                    }))
                }
            })

            return formattedData
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDataListSearch(params: { q: string }) {
        try {
            return await this.prisma.product.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                where: {
                    deleted_flg: false,
                    status: STATUS.ACTIVE,
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
                    slug: true,
                    name: true,
                    image_uri: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getListProductFlashSale() {
        try {
            // const data = await this.prisma.flashSale.findFirstOrThrow({
            //     orderBy: { created_at: 'desc' },
            //     where: {
            //         start_date: { lte: new Date() },
            //         end_date: { gte: new Date() }
            //     },
            //     select: {
            //         campaign_name: true,
            //         FlashSaleProduct: {
            //             where: {
            //                 product: {
            //                     deleted_flg: false,
            //                     status: STATUS.ACTIVE
            //                 }
            //             },
            //             select: {
            //                 product: {
            //                     select: {
            //                         id: true,
            //                         sku: true,
            //                         slug: true,
            //                         name: true,
            //                         image_uri: true,
            //                         short_description: true,
            //                         description: true,
            //                         total_rating: true,
            //                         productVariant: {
            //                             orderBy: { created_at: 'desc' },
            //                             select: {
            //                                 sku: true,
            //                                 label: true,
            //                                 productVariantPrice: {
            //                                     select: {
            //                                         in_stock: true,
            //                                         price: true,
            //                                         special_price: true,
            //                                         special_price_type: true,
            //                                         selling_price: true
            //                                     }
            //                                 }
            //                             }
            //                         },
            //                         productAttributes: {
            //                             select: {
            //                                 attribute: {
            //                                     select: {
            //                                         id: true,
            //                                         name: true
            //                                     }
            //                                 },
            //                                 productAttributeValues: {
            //                                     select: {
            //                                         attribute_value_id: true,
            //                                         attributeValues: true
            //                                     }
            //                                 }
            //                             }
            //                         },
            //                         category: {
            //                             select: {
            //                                 id: true,
            //                                 slug: true,
            //                                 name: true,
            //                                 parent: {
            //                                     select: {
            //                                         id: true,
            //                                         slug: true,
            //                                         name: true
            //                                     }
            //                                 }
            //                             }
            //                         },
            //                         brand: {
            //                             select: {
            //                                 id: true,
            //                                 name: true,
            //                                 image_uri: true
            //                             }
            //                         }
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // })

            // const formattedData = data.FlashSaleProduct.map((item) => {
            //     return {
            //         campaign_name: data.campaign_name,
            //         ...item.product,
            //         productVariant: item.product.productVariant.map(variant => ({
            //             ...variant,
            //             // ...variant.productVariantPrice,
            //             productVariantPrice: undefined
            //         })),
            //         product_attributes: item.product.productAttributes.map((_item) => ({
            //             ..._item,
            //             attribute: _item.attribute,
            //             product_attribute_values: _item.productAttributeValues.map((_values) => ({
            //                 ..._values,
            //                 attribute_values: _values.attributeValues
            //             }))
            //         }))
            //     }
            // })

            // return { ...data, FlashSaleProduct: formattedData }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDetail(slug: string) {
        try {
            const product = await this.prisma.product.findFirstOrThrow({
                where: {
                    slug,
                    deleted_flg: false,
                    status: STATUS.ACTIVE
                },
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    image_uri: true,
                    technical_specifications: true,
                    short_description: true,
                    description: true,
                    in_stock: true,
                    product_type: true,
                    meta_title: true,
                    meta_description: true,
                    total_rating: true,
                    productImage: {
                        orderBy: { index: 'asc' },
                        select: { image_uri: true }
                    },
                    productVariantPrice: {
                        select: {
                            in_stock: true,
                            price: true,
                            special_price: true,
                            special_price_type: true
                        }
                    },
                    productVariant: {
                        orderBy: { created_at: 'desc' },
                        select: {
                            sku: true,
                            label: true,
                            productVariantPrice: {
                                select: {
                                    in_stock: true,
                                    price: true,
                                    special_price: true,
                                    special_price_type: true
                                }
                            }
                        }
                    },
                    productAttributes: {
                        select: {
                            attribute: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                            productAttributeValues: {
                                select: {
                                    attribute_value_id: true,
                                    attributeValues: {
                                        select: {
                                            id: true,
                                            value: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            slug: true,
                            name: true,
                            parent: {
                                select: {
                                    id: true,
                                    slug: true,
                                    name: true
                                }
                            }
                        }
                    },
                    brand: {
                        select: {
                            id: true,
                            name: true,
                            image_uri: true
                        }
                    },
                    mainCrossSellProducts: {
                        take: 12,
                        orderBy: {
                            crossSellProduct: { created_at: 'desc' }
                        },
                        select: {
                            crossSellProduct: {
                                select: {
                                    id: true,
                                    sku: true,
                                    name: true,
                                    slug: true,
                                    image_uri: true,
                                    in_stock: true,
                                    total_rating: true,
                                    product_type: true,
                                    productAttributes: true,
                                    category: {
                                        select: {
                                            id: true,
                                            slug: true,
                                            name: true
                                        }
                                    },
                                    productVariantPrice: {
                                        select: {
                                            in_stock: true,
                                            price: true,
                                            special_price: true,
                                            special_price_type: true
                                        }
                                    },
                                    productVariant: {
                                        take: 1,
                                        orderBy: { created_at: 'desc' },
                                        where: { is_default: true },
                                        select: {
                                            productVariantPrice: {
                                                select: {
                                                    in_stock: true,
                                                    price: true,
                                                    special_price: true,
                                                    special_price_type: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    mainRelatedProducts: {
                        take: 12,
                        orderBy: {
                            relatedProduct: { created_at: 'desc' }
                        },
                        select: {
                            relatedProduct: {
                                select: {
                                    id: true,
                                    sku: true,
                                    name: true,
                                    slug: true,
                                    image_uri: true,
                                    in_stock: true,
                                    total_rating: true,
                                    product_type: true,
                                    productAttributes: true,
                                    category: {
                                        select: {
                                            id: true,
                                            slug: true,
                                            name: true
                                        }
                                    },
                                    productVariantPrice: {
                                        select: {
                                            in_stock: true,
                                            price: true,
                                            special_price: true,
                                            special_price_type: true
                                        }
                                    },
                                    productVariant: {
                                        take: 1,
                                        orderBy: { created_at: 'desc' },
                                        where: { is_default: true },
                                        select: {
                                            productVariantPrice: {
                                                select: {
                                                    in_stock: true,
                                                    price: true,
                                                    special_price: true,
                                                    special_price_type: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            return {
                ...product,
                ...(product.product_type === PRODUCT_TYPE.SINGLE ? product.productVariantPrice[0] : undefined),
                productVariant: product.productVariant.map(variant => ({
                    ...variant,
                    ...variant.productVariantPrice,
                    productVariantPrice: undefined
                })),
                crossSellProducts: product.mainCrossSellProducts.map((_item) => ({
                    ..._item.crossSellProduct,
                    ...(_item.crossSellProduct.product_type === PRODUCT_TYPE.SINGLE
                        ? _item.crossSellProduct.productVariantPrice[0]
                        : _item.crossSellProduct.productVariant[0]?.productVariantPrice)
                })),
                relatedProducts: product.mainRelatedProducts.map((_item) => ({
                    ..._item.relatedProduct,
                    ...(_item.relatedProduct.product_type === PRODUCT_TYPE.SINGLE
                        ? _item.relatedProduct.productVariantPrice[0]
                        : _item.relatedProduct.productVariant[0]?.productVariantPrice)
                })),
                product_attributes: product.productAttributes.map((_item) => ({
                    ..._item,
                    attribute: _item.attribute,
                    productAttributeValues: undefined,
                    product_attribute_values: _item.productAttributeValues.map((_values) => ({
                        ..._values,
                        attributeValues: undefined,
                        attribute_values: _values.attributeValues
                    }))
                }))
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
