export const fileExtensionURL = (fileName: string, slug: string) => {
    const fileExtension = fileName.split('.').pop()

    return `${slug}.${fileExtension}`
}

export const getProductOrderBy = (orderBy: number) => {
    const sortConditions = {
        1: { created_at: 'desc' },
        2: { created_at: 'asc' },
        3: { name: 'asc' },
        4: { name: 'desc' },
        5: { productPrice: { price: 'asc' } },
        6: { productPrice: { price: 'desc' } }
    }

    return sortConditions[orderBy]
}

export const getNormalizedList = (value: string | number[]) => {
    return Array.isArray(value) ? value.map((_v) => Number(_v)) : value ? [Number(value)] : undefined
}
