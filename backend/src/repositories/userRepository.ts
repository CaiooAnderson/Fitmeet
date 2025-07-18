import prisma from '../orm/database';
import { Prisma } from '@prisma/client';
import { validate as uuidValidate } from 'uuid';

const update = async (id: string, data: { 
  name?: string; 
  email?: string; 
  password?: string;
  xp?: number;
  level?: number;
}) => {
  return await prisma.users.update({ where: { id }, data });
};

const create = async (data: Prisma.UsersCreateInput) => {
  return await prisma.users.create({ data });
}

const findByEmail = async (email: string) => {
  return await prisma.users.findUnique({
    where: { email },
    include: {
      userAchievements: {
        select: {
          achievement: true,
        },
      },
    },
  });
};

const findByCPF = async (cpf: string) => {
  return await prisma.users.findUnique({ where: { cpf } });
}

const findById = async (id: string) => {
  return await prisma.users.findUnique({
    where: { id },
    include: {
      userAchievements: {
        select: {
          achievement: true,
        },
      },
    },
  });
};

const findAll = async () => {
  return await prisma.users.findMany();
}

const findPreferencesByUserId = async (userId: string) => {
  return await prisma.preferences.findMany({ where: { userId } });
}

const createPreference = async (data: { userId: string; typeId: string }) => {
  return await prisma.preferences.create({ data });
}

const updateAvatar = async (id: string, avatarUrl: string) => {
  return await prisma.users.update({
    where: { id },
    data: { avatar: avatarUrl },
  });
};

const updatePreferences = async (userId: string, preferences: string[]) => {
  await prisma.preferences.deleteMany({ where: { userId } });

  if (!preferences || preferences.length === 0) {
    return;
  }

  const createPreferences = preferences.map((typeId) => ({
    userId,
    typeId,
  }));

  return await prisma.preferences.createMany({
    data: createPreferences,
    skipDuplicates: true,
  });
};

const deleteUser = async (id: string) => {
  await prisma.users.delete({ where: { id } });
}

const deactivateUser = async (id: string) => {
  return await prisma.users.update({ where: { id }, data: { deletedAt: new Date() } });
}

const addXP = async (id: string, xp: number) => {
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) throw new Error('Usuário não encontrado');

  const newXP = (user.xp || 0) + xp;
  const newLevel = Math.floor(newXP / 100);

  return await prisma.users.update({
    where: { id },
    data: { xp: newXP, level: newLevel },
  });
}

const grantAchievement = async (userId: string, achievementId: string) => {

  const existingAchievement = await prisma.userAchievements.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId,
      },
    },
  });

  if (!existingAchievement) {
    await prisma.userAchievements.create({
      data: { userId, achievementId }
    });
  }
};

const grantAchievementIfNotExists = async (userId: string, achievementName: string) => {
  const achievement = await prisma.achievements.findFirst({
    where: { name: achievementName },
  });

  if (!achievement || !achievement.id) {
    console.error(`Conquista '${achievementName}' inválida ou não encontrada.`);
    return;
  }

  const existingAchievement = await prisma.userAchievements.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId: achievement.id,
      },
    },
  });

  if (!existingAchievement) {
    await prisma.userAchievements.create({
      data: { userId, achievementId: achievement.id },
    });
  }
};

export {
  update,
  create,
  findByEmail,
  findByCPF,
  findById,
  findAll,
  findPreferencesByUserId,
  createPreference,
  updateAvatar,
  updatePreferences,
  deleteUser,
  deactivateUser,
  addXP,
  grantAchievement,
  grantAchievementIfNotExists
}
