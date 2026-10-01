export interface FileStorage {
  remove(filePath: string): Promise<void>;
}
