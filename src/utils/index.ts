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

export const generateOrderCode = () => {
    // Get current date
    const currentDate = new Date()

    // Extract year, month, day, hours, minutes, and seconds
    const year = currentDate.getFullYear().toString().slice(-2)
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')
    const seconds = String(currentDate.getSeconds()).padStart(2, '0')

    // Generate a random number with 5 digits
    const randomPart = generateRandomString(5)

    // Concatenate the parts to form the order code
    const orderCode = `${year}${month}${day}-${hours}${minutes}${seconds}-${randomPart}`

    return orderCode
}

function generateRandomString(length: number) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let randomString = ''

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        randomString += characters.charAt(randomIndex)
    }

    return randomString
}
