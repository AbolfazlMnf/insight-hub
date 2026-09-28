import {
  Body,
  Controller,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { UploadDocumentDto } from './dtos/upload-document.dto';
import { UploadDocumentMulterOption } from 'src/shared/utils/upload.util';

@ApiTags(`Documents`)
@UseGuards(JwtGuard)
@Controller('document')
export class DocumentController {
  @Post(`upload/:workspaceId`)
  @UseInterceptors(FileInterceptor(`file`, UploadDocumentMulterOption))
  @ApiConsumes(`application/form-data`)
  uploadDoc(
    @Param(`workspaceId`) workspaceId: string,
    @Body() body: UploadDocumentDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {}
}
