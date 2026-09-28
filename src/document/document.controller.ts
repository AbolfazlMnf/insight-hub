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
import { User } from 'src/shared/decorators/user.decorator';
import { DocumentService } from './document.service';

@ApiTags(`Documents`)
@UseGuards(JwtGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post(`upload/:workspaceId`)
  @UseInterceptors(FileInterceptor(`file`, UploadDocumentMulterOption))
  @ApiConsumes(`multipart/form-data`)
  uploadDoc(
    @Param(`workspaceId`) workspaceId: string,
    @Body() body: UploadDocumentDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @User() userId: string,
  ) {
    return this.documentService.uploadDocument(
      file,
      body.title,
      workspaceId,
      userId,
    );
  }
}
