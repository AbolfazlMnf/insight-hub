import { Inject } from '@nestjs/common';
import {
  DOCUMENT_PROCESSING_QUEUE_PORT,
  DOCUMENT_REPOSITORY,
  FILE_STORAGE,
} from 'src/document/constants/document.token';
import type { DocumentRepository } from 'src/document/domain/repositories/document.repository';
import type { DocumentProcessingQueue } from '../ports/document-processing-queue.port';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { IUploadDocumentInput } from '../types/upload-document-input.type';
import type { FileStorage } from '../ports/file.storage.port';

export class UploadDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
    @Inject(DOCUMENT_PROCESSING_QUEUE_PORT)
    private readonly documentProcessingQueue: DocumentProcessingQueue,
    private readonly workspaceService: WorkspaceService,
    @Inject(FILE_STORAGE) private readonly fileStorage: FileStorage,
  ) {}
  async execute(input: IUploadDocumentInput) {
    let documentId: string | null = null;

    try {
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
      documentId = document.id;
      await this.documentProcessingQueue.add(document.id);
      return document;
    } catch (err) {
      if (documentId) {
        await this.documentRepository.deleteById(documentId);
      }
      await this.fileStorage.remove(input.filePath);
      throw err;
    }
  }
}
