// ** NestJS Imports
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { catchError, firstValueFrom } from 'rxjs'

// ** DTO Imports
import { CreateFileManagerDto } from './dto/create-file-manager.dto'

@Injectable()
export class FileManagerService {
    private readonly httpService = new HttpService()
    private readonly accessKey = process.env.BUNNY_CDN_ACCESS_KEY
    private readonly storageZone = process.env.BUNNY_CDN_STORAGE_ZONE
    private readonly storageName = process.env.BUNNY_CDN_STORAGE_NAME

    async getTableList(path: string) {
        const pathName = this.buildPath(path)
        const url = `${this.getBaseUrl()}${this.storageName}/${pathName}/`

        return this.sendRequest('get', url)
    }

    async create(createFileManagerDto: CreateFileManagerDto, path: string) {
        const pathName = this.buildPath(path, createFileManagerDto.folder_name + '/')
        const url = `${this.getBaseUrl()}${this.storageName}/${pathName}`

        return this.sendRequest('put', url)
    }

    async delete(createFileManagerDto: CreateFileManagerDto, path: string) {
        const pathName = this.buildPath(path, createFileManagerDto.folder_name + (createFileManagerDto.is_folder ? '/' : ''))
        const url = `${this.getBaseUrl()}${this.storageName}/${pathName}`

        return this.sendRequest('delete', url)
    }

    async uploadFile(path: string, file: Express.Multer.File) {
        const pathName = this.buildPath(path, file.originalname)
        const url = `${this.getBaseUrl()}${this.storageName}/${pathName}`

        return this.sendRequest('put', url, file.buffer)
    }

    private buildPath(...segments: string[]) {
        return segments.join('/').replace(/,/g, '/')
    }

    private getBaseUrl() {
        return this.storageZone ? `https://${this.storageZone}.storage.bunnycdn.com/` : 'https://storage.bunnycdn.com/'
    }

    private async sendRequest(method: string, url: string, data?: any) {
        try {
            const response = await firstValueFrom(
                this.httpService.request({
                    method,
                    url,
                    data,
                    headers: { Accesskey: this.accessKey }
                }).pipe(
                    catchError(() => {
                        throw 'An error happened!'
                    })
                )
            )
            return response.data
        } catch (error) {
            console.error('Error occurred:', error)
            throw error
        }
    }
}
