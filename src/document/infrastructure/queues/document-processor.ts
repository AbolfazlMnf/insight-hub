import { Processor, WorkerHost } from '@nestjs/bullmq';

import { Job } from 'bullmq';
import { IProcessDocumentJobData } from 'src/document/application/types/document-job.type';
import { ProcessDocumentUseCase } from 'src/document/application/use-cases/process-document.use-case';
import {
  DOCUMENT_PROCESSING_QUEUE,
  PROCESS_DOCUMENT_JOB,
} from 'src/document/constants/document-queue.constant';

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
