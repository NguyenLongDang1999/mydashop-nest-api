// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class WebsiteSetupService {
    constructor(private prisma: PrismaService) {}

    async getWebsiteSetup(slug: string) {
        try {
            return await this.prisma.websiteSetup.findFirst({
                where: { slug },
                select: {
                    id: true,
                    value: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDataListSystem() {
        try {
            return await this.prisma.websiteSetup.findMany({
                select: {
                    slug: true,
                    value: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
