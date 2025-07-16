import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { uploadImage, getSignedAvatarUrl } from "../services/s3Service";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const user = await UserService.getUser(req.user.id);

    if (!user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    if (user.deletedAt) {
      res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
      return;
    }

    const { password, deletedAt, userAchievements, ...userWithoutSensitiveInfo } = user;

    let avatarUrl = null;
    if (user.avatar) {
      const avatarKey = user.avatar.split(`/${bucketName}/`)[1];
      if (avatarKey) {
        avatarUrl = await getSignedAvatarUrl(avatarKey);
      }
    }

    const achievements = userAchievements
      ? userAchievements.map((ua) => ua.achievement)
      : [];

    const userResponse = {
      ...userWithoutSensitiveInfo,
      avatar: avatarUrl,
      achievements,
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const getUserPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const user = await UserService.getUser(req.user.id);

    if (!user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    if (user.deletedAt) {
      res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
      return;
    }

    const preferences = await UserService.getUserPreferences(req.user.id);

    res.status(200).json(Array.isArray(preferences) ? preferences : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const defineUserPreferences = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const user = await UserService.getUser(req.user.id);

    if (!user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    if (user.deletedAt) {
      res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
      return;
    }

    const preferences = req.body;

    await UserService.defineUserPreferences(req.user.id, preferences);

    res.status(200).json({ message: 'Preferências atualizadas.' });
  } catch (error) {
    const message = (error as Error).message;

    if (message.includes('ID inválido') || message.includes('inválido')) {
      res.status(400).json({ error: 'Um ou mais IDs informados são inválidos.' });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const updateUserAvatar = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const user = await UserService.getUser(req.user.id);

    if (!user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    if (user.deletedAt) {
      res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'A imagem deve ser um arquivo PNG ou JPG.' });
      return;
    }

    const avatarUrl = await uploadImage(req.file, 'avatars');

    await UserService.updateUserAvatar(req.user.id, avatarUrl);

    res.status(200).json({ avatarUrl });
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const user = await UserService.getUser(req.user.id);

    if (!user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    if (user.deletedAt) {
      res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
      return;
    }

    await UserService.updateUser(req.user.id, req.body);

    const updatedUser = await UserService.getUser(req.user.id);

    if (!updatedUser) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const { password, deletedAt, ...userWithoutSensitiveInfo } = updatedUser;

    res.status(200).json(userWithoutSensitiveInfo);
  } catch (error) {
    console.error(error);
    const message = (error as Error).message;

    if (message === 'E-mail já cadastrado') {
      res.status(409).json({ error: 'O e-mail informado já pertence a outro usuário.' });
      return;
    }

    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const deactivateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const user = await UserService.getUser(req.user.id);

    if (!user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    if (user.deletedAt) {
      res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
      return;
    }

    await UserService.deactivateUser(req.user.id);

    res.status(200).json({ message: 'Conta desativada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const addXP = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) throw new Error('Autenticação necessária.');

    const { xpGained } = req.body;
    await UserService.addXP(req.user.id, xpGained);

    res.status(200).json({ message: 'XP adicionado!' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export const grantAchievement = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) throw new Error('Autenticação necessária.');

    const { achievementId } = req.body;
    await UserService.grantAchievement(req.user.id, achievementId);

    res.status(200).json({ message: 'Conquista desbloqueada!' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}