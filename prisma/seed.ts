import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

// ** Argon2 Imports
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // ------------------------------- BEGIN ADMINISTRATOR -------------------------------
    await prisma.admins.deleteMany({
        where: { email: 'longdang0412@gmail.com' }
    })
    const hashPassword = await argon2.hash('dang04121999')

    await prisma.admins.create({
        data: {
            name: 'Administrator',
            email: 'longdang0412@gmail.com',
            phone: '0389747179',
            role: 1,
            password: hashPassword,
            image_uri: faker.image.urlPlaceholder({ width: 400, height: 400 })
        }
    })
    // ------------------------------- END ADMINISTRATOR -------------------------------

    // ------------------------------- BEGIN WEBSITE SETUP -------------------------------
    // ------------------------------- END WEBSITE SETUP -------------------------------

    console.log('Finish seeding ...')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
