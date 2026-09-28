import { Injectable } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentProcessorService {
  constructor(private readonly prismaService: PrismaService) {}
  async extractedPdfText(documentId: string, filePath: string) {
    try {
      const buffer = await readFile(filePath);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
