import { ErrorRequestHandler } from 'express';
import multer from 'multer';

export const multerErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'A imagem deve ser um arquivo PNG ou JPG.') {
    res.status(400).json({ error: 'A imagem deve ser um arquivo PNG ou JPG.' });
    return;
  }

  next(err);
};