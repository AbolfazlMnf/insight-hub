import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import { DocumentStatus } from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentProcessorService {
  constructor(private readonly prismaService: PrismaService) {}
  async extractPdfText(filePath: string) {
    const buffer = await readFile(filePath);
    const parser = new PDFParse({
      data: buffer,
    });
    try {
      const result = await parser.getText();
      return result.text;
    } finally {
      await parser.destroy();
    }
  }
  async findDocument(documentId: string) {
    const document = await this.prismaService.document.findUnique({
      where: {
        id: documentId,
      },
    });
    if (!document) {
      throw new NotFoundException(`document not found`);
    }
    return document;
  }
  async processDocument(documentId: string) {
    try {
      const document = await this.findDocument(documentId);
      if (document.mimeType !== `application/pdf`) {
        throw new BadRequestException('Unsupported document type');
      }

      await this.prismaService.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.PROCESSING },
      });

      const extractedText = await this.extractPdfText(document.filePath);
      if (!extractedText.trim()) {
        throw new Error('No text extracted from document');
      }

      const updatedDoc = await this.prismaService.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.READY, extractedText },
      });
      return updatedDoc;
    } catch (err) {
      await this.prismaService.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.FAILED },
      });
      throw err;
    }
  }
}
