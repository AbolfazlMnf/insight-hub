import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ProcessDocumentUseCase } from '../../application/use-cases/process-document.use-case';
import { DOCUMENT_PROCESSING_QUEUE } from '../../constants/document-queue.constant';
import { PROCESS_DOCUMENT_JOB } from '../../constants/document-queue.constant';
import { IProcessDocumentJobData } from 'src/document/application/types/document-job.type';

@Processor(DOCUMENT_PROCESSING_QUEUE)
export class DocumentProcessor extends WorkerHost {
  constructor(private readonly processDocumentUseCase: ProcessDocumentUseCase) {
    super();
  }

  async process(job: Job<IProcessDocumentJobData>) {
    console.log('JOB RECEIVED:', job.name, job.data);

    if (job.name === PROCESS_DOCUMENT_JOB) {
      await this.processDocumentUseCase.execute(job.data.documentId);
    }
  }
}
