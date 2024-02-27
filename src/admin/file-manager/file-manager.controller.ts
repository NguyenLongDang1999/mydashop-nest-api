// ** NestJS Imports
import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Query,
    Delete,
    Put,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

// ** Service Imports
import { FileManagerService } from './file-manager.service'

// ** DTO Imports
import { CreateFileManagerDto } from './dto/create-file-manager.dto'

// ** Guard Imports
import { AccessTokenGuard } from '../common/guards/accessToken.guard'

@Controller('/')
@ApiTags('File Manager')
@UseGuards(AccessTokenGuard)
export class FileManagerController {
    constructor(private readonly fileManagerService: FileManagerService) {}

    @Post()
    @ApiCreatedResponse()
    create(@Body() createFileManagerDto: CreateFileManagerDto, @Query() params: { path: string }) {
        return this.fileManagerService.create(createFileManagerDto, params.path)
    }

    @Get()
    @ApiOkResponse()
    getTableList(@Query() params: { path: string }) {
        return this.fileManagerService.getTableList(params.path)
    }

    @Put()
    @UseInterceptors(FileInterceptor('file'))
    @ApiNoContentResponse()
    uploadFile(
        @Query() params: { path: string },
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.fileManagerService.uploadFile(params.path, file)
    }

    @Delete()
    @ApiNoContentResponse()
    delete(@Body() createFileManagerDto: CreateFileManagerDto, @Query() params: { path: string }) {
        return this.fileManagerService.delete(createFileManagerDto, params.path)
    }
}
