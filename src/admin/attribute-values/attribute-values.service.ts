// ** NestJS Imports
import { Injectable, InternalServerErrorException } from '@nestjs/common'

// ** DTO Imports
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto'
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto'

// ** Prisma Imports
import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

// ** Types Imports
import { IAttributeValuesSearch } from './attribute-values.interface'

@Injectable()
export class AttributeValuesService {
    constructor(private prisma: PrismaService) {}

    async create(createAttributeValueDto: CreateAttributeValueDto) {
        try {
            return await this.prisma.attributeValues.create({
                data: createAttributeValueDto,
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async getTableList(query: IAttributeValuesSearch) {
        try {
            const { value, attribute_id, pageSize, page } = query
            const take = Number(pageSize) || undefined
            const skip = Number(page) || undefined

            const search: Prisma.AttributeValuesWhereInput = {
                deleted_flg: false,
                attribute: { deleted_flg: false },
                value: { contains: value || undefined, mode: 'insensitive' },
                attribute_id: { equals: Number(attribute_id) || undefined }
            }

            const [data, count] = await Promise.all([
                this.prisma.attributeValues.findMany({
                    take,
                    skip,
                    orderBy: { created_at: 'desc' },
                    where: search,
                    select: {
                        id: true,
                        value: true,
                        attribute_id: true,
                        attribute: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }),
                this.prisma.attributeValues.count({ where: search })
            ])

            return { data, aggregations: count }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto) {
        try {
            return await this.prisma.attributeValues.update({
                where: { id },
                data: updateAttributeValueDto
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.attributeValues.update({
                data: { deleted_flg: true },
                where: { id },
                select: { id: true }
            })
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}
