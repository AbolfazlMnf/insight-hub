import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { DocumentProcessingQueue } from 'src/document/application/ports/document-processing-queue.port';
import { IProcessDocumentJobData } from 'src/document/application/types/document-job.type';
import {
  DOCUMENT_PROCESSING_QUEUE,
  PROCESS_DOCUMENT_JOB,
} from 'src/document/constants/document-queue.constant';

export class BullDocumentProcessingQueue implements DocumentProcessingQueue {
  constructor(
    @InjectQueue(DOCUMENT_PROCESSING_QUEUE)
    private readonly queue: Queue<IProcessDocumentJobData>,
  ) {}
  async add(documentId: string): Promise<void> {
    await this.queue.add(PROCESS_DOCUMENT_JOB, {
      documentId,
    });
  }
}
