// ** NestJS Imports
import { ApiProperty } from '@nestjs/swagger'

// ** Validate Imports
import { IsNotEmpty, IsString, IsNumber, MaxLength, IsOptional, IsArray, ArrayMinSize, IsBoolean } from 'class-validator'
import { Transform } from 'class-transformer'

// ** Utils Imports
import { STATUS, POPULAR, INVENTORY_STATUS, SPECIAL_PRICE, PRODUCT_TYPE } from 'src/utils/enums'

export class AttributesDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    id: number

    @IsArray()
    @Transform(({ value }) => JSON.parse(value).map(Number))
    @ArrayMinSize(1)
    @ApiProperty({ type: [Number] })
    attribute_value_id: number[]
}

export class ProductImageDto {
    @IsOptional()
    @ApiProperty({ required: false })
    image_uri: string
}

export class VariantsDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    label: string

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty()
    is_default: boolean

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    @ApiProperty()
    sku: string

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: 0 })
    price = 0

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: 0 })
    special_price = 0

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: SPECIAL_PRICE.PRICE })
    special_price_type = SPECIAL_PRICE.PRICE

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: 0 })
    quantity = 0

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: INVENTORY_STATUS.OUT_OF_STOCK })
    in_stock = INVENTORY_STATUS.OUT_OF_STOCK
}

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @ApiProperty()
    sku: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(60)
    @ApiProperty()
    name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    slug: string

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @ApiProperty()
    category_id: number

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false })
    brand_id?: number

    @IsOptional()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value) : undefined))
    @ApiProperty({ required: false })
    attributes?: AttributesDto[]

    @IsOptional()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value) : undefined))
    @ApiProperty({ required: false })
    variants?: VariantsDto[]

    @IsOptional()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value).map(Number) : undefined))
    @ApiProperty({ required: false })
    cross_sell_products?: number[]

    @IsOptional()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value).map(Number) : undefined))
    @ApiProperty({ required: false })
    upsell_products?: number[]

    @IsOptional()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value).map(Number) : undefined))
    @ApiProperty({ required: false })
    related_products?: number[]

    @IsOptional()
    @Transform(({ value }) => (value && typeof value === 'string' ? JSON.parse(value) : undefined))
    @ApiProperty({ required: false })
    productImage?: ProductImageDto[]

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: PRODUCT_TYPE.SINGLE })
    product_type = PRODUCT_TYPE.SINGLE

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: 0 })
    price = 0

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: 0 })
    special_price = 0

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: SPECIAL_PRICE.PRICE })
    special_price_type = SPECIAL_PRICE.PRICE

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: 0 })
    quantity = 0

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: INVENTORY_STATUS.OUT_OF_STOCK })
    in_stock = INVENTORY_STATUS.OUT_OF_STOCK

    @IsOptional()
    @ApiProperty({ required: false })
    technical_specifications?: string

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
    short_description?: string

    @IsOptional()
    @ApiProperty({ required: false })
    description?: string

    @IsOptional()
    @ApiProperty({ required: false })
    image_uri?: string

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: STATUS.INACTIVE })
    status = STATUS.INACTIVE

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @ApiProperty({ required: false, default: POPULAR.INACTIVE })
    popular = POPULAR.INACTIVE

    @IsOptional()
    @MaxLength(60)
    @ApiProperty({ required: false })
    meta_title?: string

    @IsOptional()
    @MaxLength(160)
    @ApiProperty({ required: false })
    meta_description?: string
}
