// ** NestJS Imports
import { Injectable } from '@nestjs/common'

// ** Third Party Imports
import { StorageEndpoints, EdgeStorage } from 'bunnycdn'

@Injectable()
export class BunnyService {
    private readonly accessKey = process.env.BUNNY_ACCESS_KEY
    private readonly storageName = 'images-data'
    private readonly edgeStorage: EdgeStorage

    constructor() {
        this.edgeStorage = new EdgeStorage(this.accessKey, StorageEndpoints.Singapore)
    }

    async uploadFile(path: string, fileContent: Buffer) {
        const edgeStorage = this.edgeStorage.CreateClient(this.storageName)
        return await edgeStorage.UploadFile(path, fileContent)
    }
}
