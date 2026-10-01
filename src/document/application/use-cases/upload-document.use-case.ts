import { Inject } from '@nestjs/common';
import { DOCUMENT_REPOSITORY } from 'src/document/constants/document.token';
import type { DocumentRepository } from 'src/document/domain/repositories/document.repository';
import type { DocumentProcessingQueue } from '../ports/document-processing-queue.port';
import { DOCUMENT_PROCESSING_QUEUE } from 'src/document/constants/document-queue.constant';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { IUploadDocumentInput } from '../types/upload-document-input.type';

export class UploadDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
    @Inject(DOCUMENT_PROCESSING_QUEUE)
    private readonly documentProcessingQueue: DocumentProcessingQueue,
    private readonly workspaceService: WorkspaceService,
  ) {}
  async execute(input: IUploadDocumentInput) {
    await this.workspaceService.getCurrentMember(
      input.userId,
      input.workspaceId,
    );
    const document = await this.documentRepository.create(
      input.title,
      input.fileName,
      input.filePath,
      input.mimeType,
      input.workspaceId,
      input.userId,
      input.size,
    );
    await this.documentProcessingQueue.add(document.id);
    return document;
  }
}
