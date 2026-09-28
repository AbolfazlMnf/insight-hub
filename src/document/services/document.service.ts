import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { removeFile } from 'src/shared/utils/file.util';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workspaceService: WorkspaceService,
  ) {}
  async uploadDocument(
    file: Express.Multer.File,
    title: string,
    workspaceId: string,
    userId: string,
  ) {
    console.log(file);
    try {
      await this.workspaceService.getCurrentMember(userId, workspaceId);

      const uploadedDoc = await this.prismaService.document.create({
        data: {
          title,
          fileName: file.originalname,
          filePath: file.path,
          mimeType: file.mimetype,
          size: file.size,
          uploadedById: userId,
          workspaceId,
        },
      });
      return { message: `document uploaded successfully`, uploadedDoc };
    } catch (error) {
      await removeFile(file.path);
      throw error;
    }
  }
}
