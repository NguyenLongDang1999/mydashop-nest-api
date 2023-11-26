// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** Prisma Imports
import { PrismaService } from '../../prisma/prisma.service'

// ** Types Imports
import { POPULAR, STATUS } from '../../utils/enums'

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async getList() {
        try {
            return await this.prisma.category.findMany({
                orderBy: { created_at: 'desc' },
                take: 8,
                where: {
                    parent_id: null,
                    deleted_flg: false,
                    status: STATUS.ACTIVE,
                    popular: POPULAR.ACTIVE
                },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    image_uri: true,
                    children: {
                        take: 4,
                        where: {
                            deleted_flg: false,
                            status: STATUS.ACTIVE,
                            popular: POPULAR.ACTIVE
                        },
                        select: {
                            id: true,
                            slug: true,
                            name: true,
                            image_uri: true
                        }
                    }
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
