import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const fileTypes = /jpg|jpeg|png/;
  const mimeType = fileTypes.test(file.mimetype.toLowerCase());
  const extname = fileTypes.test(file.originalname.split('.').pop()?.toLowerCase() || '');

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    console.log('Tipo de arquivo inválido, deve ser JPG, JPEG ou PNG.');
    return cb(new Error('A imagem deve ser um arquivo PNG ou JPG.'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;