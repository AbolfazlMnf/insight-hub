import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';
import { DocumentTextExtractor } from 'src/document/application/ports/Document-text-extractor.port';

export class pdfTextExtractor implements DocumentTextExtractor {
  async extract(filePath: string): Promise<string> {
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
