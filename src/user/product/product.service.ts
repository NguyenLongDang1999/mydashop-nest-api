// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { STATUS } from 'src/utils/enums'

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

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
                    price: true,
                    selling_price: true,
                    special_price: true,
                    special_price_type: true,
                    meta_title: true,
                    meta_description: true,
                    total_rating: true,
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
                    // upsellProducts: {
                    //     take: 12,
                    //     select: {
                    //         mainUpSellProduct: {
                    //             select: {
                    //                 id: true,
                    //                 sku: true,
                    //                 name: true,
                    //                 slug: true,
                    //                 status: true,
                    //                 image_uri: true,
                    //                 price: true,
                    //                 in_stock: true,
                    //                 special_price: true,
                    //                 selling_price: true,
                    //                 short_description: true,
                    //                 special_price_type: true,
                    //                 Category: {
                    //                     select: {
                    //                         id: true,
                    //                         slug: true,
                    //                         name: true
                    //                     }
                    //                 },
                    //                 Brand: {
                    //                     select: {
                    //                         name: true
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // },
                    // RelatedProducts: {
                    //     take: 12,
                    //     select: {
                    //         MainRelatedProduct: {
                    //             select: {
                    //                 id: true,
                    //                 sku: true,
                    //                 name: true,
                    //                 slug: true,
                    //                 status: true,
                    //                 image_uri: true,
                    //                 price: true,
                    //                 in_stock: true,
                    //                 special_price: true,
                    //                 selling_price: true,
                    //                 short_description: true,
                    //                 special_price_type: true,
                    //                 Category: {
                    //                     select: {
                    //                         id: true,
                    //                         slug: true,
                    //                         name: true
                    //                     }
                    //                 },
                    //                 Brand: {
                    //                     select: {
                    //                         name: true
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                }
            })

            return {
                ...product,
                product_attributes: product.productAttributes.map(_item => ({
                    ..._item,
                    attribute: _item.attribute,
                    product_attribute_values: _item.productAttributeValues.map(_values => ({
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
