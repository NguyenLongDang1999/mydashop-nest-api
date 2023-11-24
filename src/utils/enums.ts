export enum PATH {
    CATEGORY = 'category',
    BRAND = 'brand',
    PRODUCT = 'product',
    SLIDER = 'slider',
}

export enum STATUS {
    ACTIVE = 10,
    INACTIVE = 20,
}

export enum POPULAR {
    ACTIVE = 10,
    INACTIVE = 20,
}

export enum INVENTORY_STATUS {
    IN_STOCK = 10,
    OUT_OF_STOCK = 20,
}

export enum SPECIAL_PRICE {
    PRICE = 10,
    PERCENT = 20,
}

export enum AUTH {
    _7_DAYS = 7 * 24 * 60 * 60 * 1000,
    _30_DAYS = 30 * 24 * 60 * 60 * 1000,
}
