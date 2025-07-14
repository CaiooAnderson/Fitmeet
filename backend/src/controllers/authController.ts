import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { registerSchema, loginSchema } from '../middlewares/authValidation';
import { uploadImage, bucketName } from '../services/s3Service';

export const register = async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: 'Informe os campos obrigatórios corretamente.' });
      return
    }

    const { name, email, cpf, password } = validation.data;

    let avatar = `${process.env.S3_ENDPOINT}/${bucketName}/avatars/default-avatar.png`;

    if (req.file) {
      avatar = await uploadImage({
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        buffer: req.file.buffer,
      }, 'avatars');
    }

    await UserService.register({ name, email, cpf, password, avatar });

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
    return
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;

    if (message === 'E-mail já cadastrado' || message === 'CPF já cadastrado') {
      res.status(409).json({
        error: 'O e-mail ou CPF informado já pertence a outro usuário.',
      });
      return
    }

    res.status(500).json({ error: 'Erro inesperado.' });
    return
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: 'Informe os campos obrigatórios corretamente.' });
      return;
    }

    const { email, password } = validation.data;
    const { token, user } = await UserService.login(email, password);

    res.status(200).json({ token, ...user });
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;

    if (message === 'Senha inválida') {
      res.status(401).json({ error: 'Senha incorreta.' });
      return;
    }

    if (message === 'Conta desativada') {
      res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
      return;
    }

    if (message === 'E-mail ou senha inválidos') {
      res.status(404).json({ error: 'Usuário não encontrado.' });
      return;
    }

    res.status(500).json({ error: 'Erro inesperado.' });
  }
};