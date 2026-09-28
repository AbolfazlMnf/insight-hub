import { Injectable, Body } from '@nestjs/common';
import { DocumentStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
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
    await this.workspaceService.getCurrentMember(userId, workspaceId);

    const uploadedDoc = await this.prismaService.document.create({
      data: {
        title,
        fileName: file.filename,
        filePath: file.path,
        mimeType: file.mimetype,
        size: file.size,
        uploadedById: userId,
        workspaceId,
      },
    });
    return { message: `document uploaded successfully`, uploadedDoc };
  }
}
