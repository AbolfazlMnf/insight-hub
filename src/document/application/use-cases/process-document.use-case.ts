import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  DOCUMENT_TEXT_EXTRACTOR,
} from 'src/document/constants/document.token';
import type { DocumentRepository } from 'src/document/domain/repositories/document.repository';
import type { DocumentTextExtractor } from '../ports/Document-text-extractor.port';
import { DocumentStatus } from 'src/generated/prisma/enums';

@Injectable()
export class ProcessDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: DocumentRepository,
    @Inject(DOCUMENT_TEXT_EXTRACTOR)
    private readonly documentTextExtractor: DocumentTextExtractor,
  ) {}
  async execute(documentId: string) {
    console.log(`start processing`);

    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.mimeType !== 'application/pdf') {
      throw new BadRequestException('Unsupported document type');
    }
    await this.documentRepository.updateStatus(
      documentId,
      DocumentStatus.PROCESSING,
    );
    try {
      const extractedText = await this.documentTextExtractor.extract(
        document.filePath,
      );
      if (!extractedText.trim()) {
        throw new Error(`No text extracted from document`);
      }
      return this.documentRepository.saveExtractedText(
        documentId,
        extractedText,
        DocumentStatus.READY,
      );
    } catch (err) {
      await this.documentRepository.updateStatus(
        documentId,
        DocumentStatus.FAILED,
      );
      throw err;
    }
  }
}
