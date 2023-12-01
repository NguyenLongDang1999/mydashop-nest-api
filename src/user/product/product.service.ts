// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { SHOW_PRODUCT, STATUS } from 'src/utils/enums'

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
                            },
                            productPrice: {
                                select: {
                                    price: true,
                                    selling_price: true,
                                    special_price: true,
                                    special_price_type: true
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
                        ..._p.productPrice
                    }))
                }
            })

            return formattedData
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getListProductFlashSale() {
        try {
            const data = await this.prisma.flashSale.findFirstOrThrow({
                orderBy: { created_at: 'desc' },
                where: {
                    start_date: { lte: new Date() },
                    end_date: { gte: new Date() }
                },
                select: {
                    campaign_name: true,
                    FlashSaleProduct: {
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
                                    technical_specifications: true,
                                    short_description: true,
                                    description: true,
                                    in_stock: true,
                                    meta_title: true,
                                    meta_description: true,
                                    total_rating: true,
                                    productPrice: {
                                        select: {
                                            price: true,
                                            selling_price: true,
                                            special_price: true,
                                            special_price_type: true
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
                                                    attributeValues: true
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

            const formattedData = data.FlashSaleProduct.map((item) => {
                return {
                    campaign_name: data.campaign_name,
                    ...item.product,
                    ...item.product.productPrice,
                    product_attributes: item.product.productAttributes.map((_item) => ({
                        ..._item,
                        attribute: _item.attribute,
                        product_attribute_values: _item.productAttributeValues.map((_values) => ({
                            ..._values,
                            attribute_values: _values.attributeValues
                        }))
                    }))
                }
            })

            return { ...data, FlashSaleProduct: formattedData }
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
                    meta_title: true,
                    meta_description: true,
                    total_rating: true,
                    productPrice: {
                        select: {
                            price: true,
                            selling_price: true,
                            special_price: true,
                            special_price_type: true
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
                                    attributeValues: true
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
                    upsellProducts: {
                        take: 12,
                        select: {
                            mainUpSellProduct: {
                                select: {
                                    id: true,
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
                                    },
                                    productPrice: {
                                        select: {
                                            price: true,
                                            selling_price: true,
                                            special_price: true,
                                            special_price_type: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    relatedProducts: {
                        take: 12,
                        select: {
                            mainRelatedProduct: {
                                select: {
                                    id: true,
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
                                    },
                                    productPrice: {
                                        select: {
                                            price: true,
                                            selling_price: true,
                                            special_price: true,
                                            special_price_type: true
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
                ...product.productPrice,
                relatedProducts: product.relatedProducts.map((_item) => ({
                    ..._item.mainRelatedProduct,
                    ..._item.mainRelatedProduct.productPrice
                })),
                product_attributes: product.productAttributes.map((_item) => ({
                    ..._item,
                    attribute: _item.attribute,
                    product_attribute_values: _item.productAttributeValues.map((_values) => ({
                        ..._values,
                        attribute_values: _values.attributeValues
                    }))
                }))
            }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
