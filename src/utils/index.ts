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
        5: { productPrice: { selling_price: 'asc' } },
        6: { productPrice: { selling_price: 'desc' } }
    }

    return sortConditions[orderBy]
}

export const getNormalizedList = (value: string | number[]) => {
    return Array.isArray(value) ? value.map((_v) => Number(_v)) : value ? [Number(value)] : undefined
}

export const generateUUIDv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
}
