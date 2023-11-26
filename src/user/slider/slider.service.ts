// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from 'src/prisma/prisma.service'

// ** Utils Imports
import { STATUS } from 'src/utils/enums'

@Injectable()
export class SliderService {
    constructor(private prisma: PrismaService) {}

    async getList() {
        try {
            return await this.prisma.slider.findMany({
                orderBy: { created_at: 'desc' },
                take: 6,
                where: {
                    deleted_flg: false,
                    status: STATUS.ACTIVE
                },
                select: {
                    id: true,
                    url: true,
                    name: true,
                    image_uri: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
