export interface DocumentProcessingQueue {
  add(documentId: string): Promise<void>;
}
