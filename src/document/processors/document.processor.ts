import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  DOCUMENT_PROCESSING_QUEUE,
  PROCESS_DOCUMENT_JOB,
} from '../constants/document-queue.constant';
import { DocumentProcessorService } from '../services/document-processor.service';
import { Job } from 'bullmq';
import { IProcessDocumentJobData } from '../types/document-job.type';

@Processor(DOCUMENT_PROCESSING_QUEUE)
export class DocumentProcessor extends WorkerHost {
  constructor(
    private readonly documentProcessorService: DocumentProcessorService,
  ) {
    super();
  }
  async process(job: Job<IProcessDocumentJobData>) {
    if (job.name === PROCESS_DOCUMENT_JOB) {
      console.log(`processing started`);
      await this.documentProcessorService.processDocument(job.data.documentId);
    }
  }
}
