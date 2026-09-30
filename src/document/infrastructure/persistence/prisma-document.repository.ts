import { DocumentRepository } from 'src/document/domain/repositories/document.repository';
import { Document, DocumentStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findById(documentId: string): Promise<Document | null> {
    return this.prismaService.document.findUnique({
      where: { id: documentId },
    });
  }
  async create(
    title: string,
    fileName: string,
    filePath: string,
    mimeType: string,
    workspaceId: string,
    uploadedById: string,
    size: number,
  ): Promise<Document> {
    return this.prismaService.document.create({
      data: {
        title,
        fileName,
        filePath,
        mimeType,
        size,
        workspaceId,
        uploadedById,
      },
    });
  }
  async updateStatus(
    documentId: string,
    status: DocumentStatus,
  ): Promise<Document> {
    return this.prismaService.document.update({
      where: { id: documentId },
      data: { status },
    });
  }
  async saveExtractedText(
    id: string,
    extractedText: string,
    status: DocumentStatus,
  ) {
    return this.prismaService.document.update({
      where: { id },
      data: {
        extractedText,
        status,
      },
    });
  }
}
