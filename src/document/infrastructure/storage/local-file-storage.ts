import { unlink } from 'node:fs/promises';
import { FileStorage } from 'src/document/application/ports/file.storage.port';

export class LocalFileStorage implements FileStorage {
  async remove(filePath: string): Promise<void> {
    try {
      await unlink(filePath);
    } catch (err) {
      console.log(`remove file error : ${err}`);
    }
  }
}
