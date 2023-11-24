// ** NestJS Imports
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateSliderDto } from './dto/create-slider.dto'
import { UpdateSliderDto } from './dto/update-slider.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { ISliderSearch } from './slider.interface'

@Injectable()
export class SliderService {
    constructor(private prisma: PrismaService) {}

    async create(createSliderDto: CreateSliderDto) {
        try {
            return await this.prisma.slider.create({
                data: createSliderDto,
                select: { id: true }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: ISliderSearch) {
        try {
            const take = Number(query.pageSize) || undefined
            const skip = Number(query.page) || undefined

            const search: Prisma.SliderWhereInput = {
                deleted_flg: false,
                name: { contains: query.name || undefined, mode: 'insensitive' },
                status: { equals: Number(query.status) || undefined }
            }

            const [data, count] = await Promise.all([
                this.prisma.slider.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        url: true,
                        name: true,
                        status: true,
                        description: true,
                        image_uri: true,
                        created_at: true,
                        updated_at: true
                    }
                }),
                this.prisma.slider.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateSliderDto: UpdateSliderDto) {
        try {
            return await this.prisma.slider.update({
                data: updateSliderDto,
                where: { id },
                select: { id: true }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.slider.update({
                data: { deleted_flg: true },
                where: { id },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
