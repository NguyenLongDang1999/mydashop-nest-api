// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateWebsiteSetupDto } from './dto/create-website-setup.dto'
import { UpdateWebsiteSetupDto } from './dto/update-website-setup.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
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

    async update(id: number, updateWebsiteSetupDto: UpdateWebsiteSetupDto) {
        try {
            return await this.prisma.websiteSetup.update({
                where: {
                    slug: updateWebsiteSetupDto.slug
                },
                data: {
                    value: updateWebsiteSetupDto.value
                },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
