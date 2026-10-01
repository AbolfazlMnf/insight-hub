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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/shared/guards/jwt.guard';
import { UploadDocumentMulterOption } from 'src/shared/utils/upload.util';
import { User } from 'src/shared/decorators/user.decorator';
import { UploadDocumentUseCase } from '../application/use-cases/upload-document.use-case';
import { UploadDocumentDto } from '../dtos/upload-document.dto';

@ApiTags(`Documents`)
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly uploadDocumentUseCase: UploadDocumentUseCase) {}

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
    return this.uploadDocumentUseCase.execute({
      title: body.title,
      userId,
      workspaceId,
      fileName: file.originalname,
      filePath: file.path,
      size: file.size,
      mimeType: file.mimetype,
    });
  }
}
