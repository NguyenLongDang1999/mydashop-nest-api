// ** NestJS Imports
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreatePageDto } from './dto/create-page.dto'
import { UpdatePageDto } from './dto/update-page.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IPagesSearch } from './pages.interface'

@Injectable()
export class PagesService {
    constructor(private prisma: PrismaService) {}

    async create(createPageDto: CreatePageDto) {
        try {
            return await this.prisma.pages.create({
                data: createPageDto,
                select: { id: true }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: IPagesSearch) {
        try {
            const take = Number(query.pageSize) || undefined
            const skip = Number(query.page) || undefined

            const search: Prisma.PagesWhereInput = {
                name: { contains: query.name || undefined, mode: 'insensitive' },
                status: { equals: Number(query.status) || undefined }
            }

            const [data, count] = await Promise.all([
                this.prisma.pages.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        status: true,
                        created_at: true
                    }
                }),
                this.prisma.pages.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getDetail(id: number) {
        try {
            return await this.prisma.pages.findFirstOrThrow({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    status: true,
                    content: true,
                    meta_title: true,
                    meta_description: true
                }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updatePageDto: UpdatePageDto) {
        try {
            return await this.prisma.pages.update({
                data: updatePageDto,
                where: { id }
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new ConflictException()
            }

            throw new InternalServerErrorException()
        }
    }

    async delete(id: number) {
        try {
            return await this.prisma.pages.delete({ where: { id } })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
