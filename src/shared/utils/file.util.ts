import { unlink } from 'fs/promises';

export const removeFile = async (filePath: string) => {
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Failed to remove file:', error);
  }
};
