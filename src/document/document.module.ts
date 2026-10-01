import { Module } from '@nestjs/common';
import { DocumentService } from './services/document.service';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { DocumentProcessorService } from './services/document-processor.service';
import { BullModule } from '@nestjs/bullmq';
import { DOCUMENT_PROCESSING_QUEUE } from './constants/document-queue.constant';
import { PrismaDocumentRepository } from './infrastructure/persistence/prisma-document.repository';
import {
  DOCUMENT_REPOSITORY,
  DOCUMENT_TEXT_EXTRACTOR,
} from './constants/document.token';
import { pdfTextExtractor } from './infrastructure/parsing/pdf-text-extractor';
import { ProcessDocumentUseCase } from './application/use-cases/process-document.use-case';
import { DocumentProcessor } from './infrastructure/queues/document.processor';
import { DocumentController } from './presentation/document.controller';

@Module({
  imports: [
    WorkspaceModule,
    BullModule.registerQueue({
      name: DOCUMENT_PROCESSING_QUEUE,
    }),
  ],
  providers: [
    DocumentService,
    DocumentProcessorService,
    DocumentProcessor,
    PrismaDocumentRepository,
    pdfTextExtractor,
    {
      provide: DOCUMENT_REPOSITORY,
      useExisting: PrismaDocumentRepository,
    },
    {
      provide: DOCUMENT_TEXT_EXTRACTOR,
      useExisting: pdfTextExtractor,
    },
    ProcessDocumentUseCase,
  ],
  controllers: [DocumentController],
})
export class DocumentModule {}
