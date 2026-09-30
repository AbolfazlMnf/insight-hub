import { Document, DocumentStatus } from 'src/generated/prisma/client';

export interface DocumentRepository {
  findById(documentId: string): Promise<Document | null>;
  create(
    title: string,
    fileName: string,
    filePath: string,
    mimeType: string,
    workspaceId: string,
    uploadedById: string,
    size: number,
  ): Promise<Document>;
  updateStatus(documentId: string, status: DocumentStatus): Promise<Document>;
  saveExtractedText(
    documentId: string,
    extractedText: string,
    status: DocumentStatus,
  ): Promise<Document>;
}
