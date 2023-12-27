// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { POPULAR, PRODUCT_TYPE, SHOW_PRODUCT, STATUS } from 'src/utils/enums'

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
                            total_rating: true,
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
                                    quantity: true,
                                    price: true,
                                    special_price: true,
                                    special_price_type: true,
                                    discount_start_date: true,
                                    discount_end_date: true,
                                    discount_type: true,
                                    discount_amount: true
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
                                            special_price: true,
                                            special_price_type: true,
                                            discount_start_date: true,
                                            discount_end_date: true,
                                            discount_type: true,
                                            discount_amount: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            const formattedData = data.map((item) => {
                return {
                    ...item,
                    Product: item.Product.map((_p) => ({
                        ..._p,
                        ..._p.productVariantPrice[0],
                        variants: _p.productVariant.map(_p => ({
                            ..._p,
                            ..._p.productVariantPrice
                        }))
                    }))
                }
            })

            return formattedData
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getListProductPopular() {
        try {
            const data = await this.prisma.product.findMany({
                take: 12,
                orderBy: { created_at: 'desc' },
                where: {
                    deleted_flg: false,
                    status: STATUS.ACTIVE,
                    popular: POPULAR.ACTIVE
                },
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    slug: true,
                    image_uri: true,
                    total_rating: true,
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
                            quantity: true,
                            price: true,
                            special_price: true,
                            special_price_type: true,
                            discount_start_date: true,
                            discount_end_date: true,
                            discount_type: true,
                            discount_amount: true
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
                                    special_price: true,
                                    special_price_type: true,
                                    discount_start_date: true,
                                    discount_end_date: true,
                                    discount_type: true,
                                    discount_amount: true
                                }
                            }
                        }
                    }
                }
            })

            const formattedData = data.map((item) => {
                return {
                    ...item,
                    ...item.productVariantPrice[0],
                    variants: item.productVariant.map(_p => ({
                        ..._p,
                        ..._p.productVariantPrice
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
            const data = await this.prisma.flashDeals.findFirstOrThrow({
                orderBy: { created_at: 'desc' },
                where: {
                    start_date: { lte: new Date() },
                    end_date: { gte: new Date() },
                    status: STATUS.ACTIVE,
                    popular: POPULAR.ACTIVE
                },
                select: {
                    campaign_name: true,
                    start_date: true,
                    end_date: true,
                    flashDealsProduct: {
                        where: {
                            product: {
                                deleted_flg: false,
                                status: STATUS.ACTIVE
                            }
                        },
                        select: {
                            product: {
                                select: {
                                    id: true,
                                    sku: true,
                                    slug: true,
                                    name: true,
                                    image_uri: true,
                                    product_type: true,
                                    short_description: true,
                                    description: true,
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
                                            special_price_type: true,
                                            discount_start_date: true,
                                            discount_end_date: true,
                                            discount_type: true,
                                            discount_amount: true
                                        }
                                    },
                                    productVariant: {
                                        take: 1,
                                        orderBy: { created_at: 'desc' },
                                        where: { is_default: true },
                                        select: {
                                            sku: true,
                                            label: true,
                                            productVariantPrice: {
                                                select: {
                                                    in_stock: true,
                                                    price: true,
                                                    special_price: true,
                                                    special_price_type: true,
                                                    discount_start_date: true,
                                                    discount_end_date: true,
                                                    discount_type: true,
                                                    discount_amount: true
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
                                    }
                                }
                            }
                        }
                    }
                }
            })

            const formattedData = data.flashDealsProduct.map((item) => {
                return {
                    campaign_name: data.campaign_name,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    // ...item.product,
                    // ...item.product.productVariantPrice[0],
                    // variants: item.product.productVariant.map(_p => ({
                    //     ..._p,
                    //     ..._p.productVariantPrice
                    // })),
                    ...item.product,
                    ...(item.product.product_type === PRODUCT_TYPE.SINGLE ? item.product.productVariantPrice[0] : undefined),
                    productVariant: item.product.productVariant.map(variant => ({
                        ...variant,
                        ...variant.productVariantPrice,
                        productVariantPrice: undefined
                    })),
                    product_attributes: item.product.productAttributes.map((_item) => ({
                        ..._item,
                        attribute: _item.attribute,
                        productAttributeValues: undefined,
                        product_attribute_values: _item.productAttributeValues.map((_values) => ({
                            ..._values,
                            attributeValues: undefined,
                            attribute_values: _values.attributeValues
                        }))
                    })),
                    productImage: item.product.productImage.filter(_image => _image.image_uri)
                }
            })

            return { ...data, flashDealsProduct: formattedData }
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
                            special_price_type: true,
                            discount_start_date: true,
                            discount_end_date: true,
                            discount_type: true,
                            discount_amount: true
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
                                    special_price_type: true,
                                    discount_start_date: true,
                                    discount_end_date: true,
                                    discount_type: true,
                                    discount_amount: true
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
                                            special_price_type: true,
                                            discount_start_date: true,
                                            discount_end_date: true,
                                            discount_type: true,
                                            discount_amount: true
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
                                                    special_price_type: true,
                                                    discount_start_date: true,
                                                    discount_end_date: true,
                                                    discount_type: true,
                                                    discount_amount: true
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
                                            special_price_type: true,
                                            discount_start_date: true,
                                            discount_end_date: true,
                                            discount_type: true,
                                            discount_amount: true
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
                                                    special_price_type: true,
                                                    discount_start_date: true,
                                                    discount_end_date: true,
                                                    discount_type: true,
                                                    discount_amount: true
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
                ...product.productVariantPrice[0],
                variants: product.productVariant.map(_p => ({
                    ..._p,
                    ..._p.productVariantPrice
                })),
                crossSellProducts: product.mainCrossSellProducts.map((_item) => ({
                    ..._item.crossSellProduct.productVariantPrice[0],
                    variants: _item.crossSellProduct.productVariant.map(_p => ({
                        ..._p,
                        ..._p.productVariantPrice
                    }))
                })),
                relatedProducts: product.mainRelatedProducts.map((_item) => ({
                    ..._item.relatedProduct.productVariantPrice[0],
                    variants: _item.relatedProduct.productVariant.map(_p => ({
                        ..._p,
                        ..._p.productVariantPrice
                    }))
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
                })),
                productImage: product.productImage.filter(_image => _image.image_uri)
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
