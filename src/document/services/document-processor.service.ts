import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentProcessorService {
  constructor(private readonly prismaService: PrismaService) {}
  async extractedPdfText(documentId: string, filePath: string) {
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
}
