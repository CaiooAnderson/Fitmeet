import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(3, "O nome precisa de pelo menos 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  cpf: z.string().regex(/^\d{11}$/, "O CPF precisa de 11 dígitos numéricos"),
  password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
}).strict();

export const loginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido"),
  password: z.string().min(6, "A senha precisa de pelo menos 6 caracteres"),
}).strict();

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const validation = schema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: 'Informe os campos obrigatórios corretamente.' });
    return;
  }

  next();
};