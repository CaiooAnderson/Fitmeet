import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../orm/database';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error('SECRET_KEY não definida no ambiente');
}

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
  };
};

export const generateToken = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    res.status(401).json({ message: 'Acesso negado. O Token precisa ser fornecido.' });
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (!decoded || !decoded.id || !decoded.email) {
      res.status(401).json({ message: 'Token inválido.' });
      return;
    }

    req.user = { id: decoded.id, email: decoded.email };

    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(401).json({ message: 'Token inválido.' });
  }
};
