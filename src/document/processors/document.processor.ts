import { Processor, WorkerHost } from '@nestjs/bullmq';
import {
  DOCUMENT_PROCESSING_QUEUE,
  PROCESS_DOCUMENT_JOB,
} from '../constants/document-queue.constant';
import { Job } from 'bullmq';
import { IProcessDocumentJobData } from '../types/document-job.type';
import { ProcessDocumentUseCase } from '../application/use-cases/process-document.use-case';

@Processor(DOCUMENT_PROCESSING_QUEUE)
export class DocumentProcessor extends WorkerHost {
  constructor(private readonly processDocumentUseCase: ProcessDocumentUseCase) {
    super();
  }
  async process(job: Job<IProcessDocumentJobData>) {
    if (job.name === PROCESS_DOCUMENT_JOB) {
      console.log(`processing started`);
      await this.processDocumentUseCase.execute(job.data.documentId);
    }
  }
}
