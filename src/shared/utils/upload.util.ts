import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const allowedMimeType = [
  'application/pdf',
  'text/plain',
  'text/markdown',
];
export const UploadDocumentMulterOption = {
  storage: diskStorage({
    destination: `./uploads/documents`,
    filename(req, file, callback) {
      const extension = extname(file.originalname);
      const fileName = `${randomUUID()}${extension}`;
      callback(null, fileName);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeType.includes(file.mimetype)) {
      return callback(
        new BadRequestException('Only PDF, TXT and MD files are allowed'),
        false,
      );
    }
    callback(null, true);
  },
};
