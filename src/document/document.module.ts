import { Module } from '@nestjs/common';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { BullModule } from '@nestjs/bullmq';
import { DOCUMENT_PROCESSING_QUEUE } from './constants/document-queue.constant';
import { PrismaDocumentRepository } from './infrastructure/persistence/prisma-document.repository';
import {
  DOCUMENT_PROCESSING_QUEUE_PORT,
  DOCUMENT_REPOSITORY,
  DOCUMENT_TEXT_EXTRACTOR,
  FILE_STORAGE,
} from './constants/document.token';
import { pdfTextExtractor } from './infrastructure/parsing/pdf-text-extractor';
import { ProcessDocumentUseCase } from './application/use-cases/process-document.use-case';
import { DocumentProcessor } from './infrastructure/queues/document-processor';
import { DocumentController } from './presentation/document.controller';
import { BullDocumentProcessingQueue } from './infrastructure/queues/bull-document-processing.queue';
import { LocalFileStorage } from './infrastructure/storage/local-file-storage';
import { UploadDocumentUseCase } from './application/use-cases/upload-document.use-case';

@Module({
  imports: [
    WorkspaceModule,
    BullModule.registerQueue({
      name: DOCUMENT_PROCESSING_QUEUE,
    }),
  ],
  providers: [
    DocumentProcessor,
    PrismaDocumentRepository,
    pdfTextExtractor,
    BullDocumentProcessingQueue,
    LocalFileStorage,
    UploadDocumentUseCase,

    {
      provide: DOCUMENT_REPOSITORY,
      useExisting: PrismaDocumentRepository,
    },
    {
      provide: DOCUMENT_TEXT_EXTRACTOR,
      useExisting: pdfTextExtractor,
    },
    {
      provide: DOCUMENT_PROCESSING_QUEUE_PORT,
      useExisting: BullDocumentProcessingQueue,
    },
    {
      provide: FILE_STORAGE,
      useExisting: LocalFileStorage,
    },
    ProcessDocumentUseCase,
  ],
  controllers: [DocumentController],
})
export class DocumentModule {}
