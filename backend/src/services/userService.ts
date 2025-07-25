import * as UserRepository from '../repositories/userRepository';
import * as ActivityRepository from '../repositories/activityRepository';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../repositories/user';
import { getDefaultAvatarUrl } from './s3Service';
import prisma from '../orm/database';

const SECRET_KEY = process.env.SECRET_KEY || '123';
const XP_PER_LEVEL = 100;

const register = async (data: { 
  name: string; 
  email: string; 
  cpf: string; 
  password: string;
  avatar?: string;
}) => {
  if (!data.name || !data.email || !data.cpf || !data.password) {
    throw new Error('Para se registrar necessita informar o nome, email, cpf e senha.');
  }
  
  const existingEmail = await UserRepository.findByEmail(data.email);
  if (existingEmail) throw new Error('E-mail já cadastrado');

  const existingCPF = await UserRepository.findByCPF(data.cpf);
  if (existingCPF) throw new Error('CPF já cadastrado');

  const hashedPassword = await bcryptjs.hash(data.password, 10);

  const avatarUrl = data.avatar || await getDefaultAvatarUrl();

  return await UserRepository.create({ 
    ...data, 
    password: hashedPassword,
    avatar: avatarUrl,
    deletedAt: null
  });
}

const login = async (email: string, password: string) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error('E-mail ou senha inválidos');

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Senha inválida');

  if (user.deletedAt) throw new Error('Conta desativada');

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

  const { password: _, deletedAt, userAchievements, ...userWithoutSensitiveInfo } = user;

  const achievements = userAchievements
    ? userAchievements.map((ua) => ua.achievement)
    : [];

  return {
    token,
    user: {
      ...userWithoutSensitiveInfo,
      achievements,
    },
  };
};

const getUser = async (id: string) => {
  return await UserRepository.findById(id);
}

const getUserPreferences = async (id: string) => {
  const preferences = await UserRepository.findPreferencesByUserId(id);

  if (!preferences || preferences.length === 0) {
    return [];
  }

  const typeIds = preferences.map((pref) => pref.typeId);

  const activityTypes = await ActivityRepository.getActivityTypes();

  const filteredPreferences = activityTypes
    .filter((type) => typeIds.includes(type.id))
    .map(({ id, name, description }) => ({ id, name, description }));

  return filteredPreferences;
};

const defineUserPreferences = async (userId: string, preferences: string[]) => {
  if (!Array.isArray(preferences) || preferences.length === 0) {
    await UserRepository.updatePreferences(userId, []);
    return;
  }

  const allTypes = await ActivityRepository.getActivityTypes();
  const validIds = allTypes.map((type) => type.id);

  const hasInvalidId = preferences.some((id) => !validIds.includes(id));

  if (hasInvalidId) {
    throw new Error('Um ou mais IDs informados são inválidos.');
  }

  await UserRepository.updatePreferences(userId, preferences);
};

const updateUserAvatar = async (id: string, avatarUrl: string) => {
  return await UserRepository.updateAvatar(id, avatarUrl);
};

const updateUser = async (id: string, data: { 
  name?: string; 
  email?: string;
  password?: string; 
  }) => {
  const user = await UserRepository.findById(id);
  if (!user) throw new Error('Usuário não encontrado');

  if (data.email) {
    const existingEmail = await UserRepository.findByEmail(data.email);
    if (existingEmail && existingEmail.id !== id) {
      throw new Error('E-mail já cadastrado');
    }
  }

  if (data.password) {
    data.password = await bcryptjs.hash(data.password, 10);
  }

  await UserRepository.update(id, {
    name: data.name,
    email: data.email,
    password: data.password
  });

  return await UserRepository.findById(id);
}

const deactivateUser = async (id: string) => {
  await UserRepository.deactivateUser(id);
}

const addXP = async (userId: string, xpGained: number) => {
  const user = await UserRepository.findById(userId);
  if (!user) throw new Error('Usuário não encontrado');

  const newXP = (user.xp || 0) + xpGained;
  const newLevel = Math.floor(newXP / XP_PER_LEVEL);

  await UserRepository.update(userId, { xp: newXP, level: newLevel });

  if (newLevel > user.level) {
    await grantAchievement(userId, '+1 LEVEL!');
  }

  return await UserRepository.findById(userId);
}

const grantAchievement = async (userId: string, achievementId: string) => {
  return await UserRepository.grantAchievement(userId, achievementId);
}

export {
  register,
  login,
  getUser,
  getUserPreferences,
  defineUserPreferences,
  updateUserAvatar,
  updateUser,
  deactivateUser,
  addXP,
  grantAchievement
}