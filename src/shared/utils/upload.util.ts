import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const UploadDocumentMulterOption = {
  storage: diskStorage({
    destination: `./uploads/documents`,
    filename(req, file, callback) {
      const extension = extname(file.originalname);
      const fileName = `${randomUUID()}${extension}`;
      callback(null, fileName);
    },
  }),
};
