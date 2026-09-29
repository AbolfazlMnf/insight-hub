import { Module } from '@nestjs/common';
import { DocumentService } from './services/document.service';
import { DocumentController } from './document.controller';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { DocumentProcessorService } from './services/document-processor.service';
import { BullModule } from '@nestjs/bullmq';
import { DOCUMENT_PROCESSING_QUEUE } from './constants/document-queue.constant';

@Module({
  imports: [
    WorkspaceModule,
    BullModule.registerQueue({
      name: DOCUMENT_PROCESSING_QUEUE,
    }),
  ],
  providers: [DocumentService, DocumentProcessorService],
  controllers: [DocumentController],
})
export class DocumentModule {}
