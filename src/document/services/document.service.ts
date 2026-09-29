import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { removeFile } from 'src/shared/utils/file.util';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  DOCUMENT_PROCESSING_QUEUE,
  PROCESS_DOCUMENT_JOB,
} from '../constants/document-queue.constant';
import { IProcessDocumentJobData } from '../types/document-job.type';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly workspaceService: WorkspaceService,
    @InjectQueue(DOCUMENT_PROCESSING_QUEUE)
    private readonly documentQueue: Queue<IProcessDocumentJobData>,
  ) {}
  async uploadDocument(
    file: Express.Multer.File,
    title: string,
    workspaceId: string,
    userId: string,
  ) {
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
      try {
        await this.documentQueue.add(PROCESS_DOCUMENT_JOB, {
          documentId: uploadedDoc.id,
        });
      } catch (err) {
        console.log(err);
      }

      return uploadedDoc;
    } catch (error) {
      await removeFile(file.path);
      throw error;
    }
  }
}
