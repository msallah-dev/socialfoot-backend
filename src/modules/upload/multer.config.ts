import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer from 'multer';


export const multerConfig = (): MulterOptions => ({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Format non supporté'), false);
    }

    callback(null, true);
  }
  
});