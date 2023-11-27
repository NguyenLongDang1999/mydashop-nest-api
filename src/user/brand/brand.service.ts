// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { STATUS } from 'src/utils/enums'

@Injectable()
export class BrandService {
    constructor(private prisma: PrismaService) {}

    async getListAll() {
        try {
            return await this.prisma.brand.findMany({
                orderBy: { created_at: 'desc' },
                where: {
                    deleted_flg: false,
                    status: STATUS.ACTIVE
                },
                select: {
                    id: true,
                    name: true,
                    image_uri: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
