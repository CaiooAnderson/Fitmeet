import * as ActivityRepository from '../repositories/activityRepository';
import * as UserRepository from '../repositories/userRepository';
import * as UserService from './userService';
import { grantAchievementIfNotExists } from '../repositories/userRepository';
import { uploadImage } from './s3Service';
import prisma from "../orm/database";
import { generateToken } from '../middlewares/authMiddleware';

const XP_PER_CHECKIN = 50;

export enum UserSubscriptionStatus {
  Inscrito = "Inscrito",
  Pendente = "Pendente",
  NãoInscrito = "Não inscrito",
}

export const determineUserSubscriptionStatus = async (userId: string, activityId: string): Promise<UserSubscriptionStatus> => {
  const activity = await prisma.activities.findUnique({
    where: { id: activityId },
    select: {
      creatorId: true,
    }
  });

  if (!activity) return UserSubscriptionStatus.NãoInscrito;

  if (activity.creatorId === userId) return UserSubscriptionStatus.NãoInscrito;

  const participant = await prisma.activityParticipants.findUnique({
    where: {
      activityId_userId: {
        activityId,
        userId,
      }
    },
    select: {
      approved: true
    }
  });

  if (!participant) return UserSubscriptionStatus.NãoInscrito;

  if (participant.approved === true) return UserSubscriptionStatus.Inscrito;
  if (participant.approved === false) return UserSubscriptionStatus.NãoInscrito;
  return UserSubscriptionStatus.Pendente;
};

const getActivityTypes = async () => {
  return await ActivityRepository.getActivityTypes();
}

const listActivities = async (userId: string, filters: any) => {
  if (!filters.typeId) {
    const userPreferences = await UserRepository.findPreferencesByUserId(userId);
    const preferredTypes = userPreferences.map(pref => pref.typeId);
    return await ActivityRepository.listActivitiesByTypes(preferredTypes, filters.skip, filters.take);
  }

  return await ActivityRepository.listActivities(filters, filters.skip, filters.take);
};

const listAllActivities = async (userId: string, filters: { typeId?: string, orderBy?: string, order?: string }) => {
  if (!filters.typeId) {
    const userPreferences = await UserRepository.findPreferencesByUserId(userId);
    const typeIds = userPreferences.map(pref => pref.typeId);

    return await ActivityRepository.listAllActivitiesByTypes(typeIds, filters.orderBy, filters.order);
  }

  return await ActivityRepository.listAllActivities(filters);
};

const getUserCreatedActivities = async (userId: string, pagination: { skip: number; take: number }) => {
  return await ActivityRepository.getUserCreatedActivities(userId, pagination);
}

const getAllUserCreatedActivities = async (userId: string) => {
  const activities = await ActivityRepository.getAllUserCreatedActivities(userId);

  const sortedActivities = activities.sort((a, b) => {
    const aCompleted = a.completedAt;
    const bCompleted = b.completedAt;

    if (aCompleted === null && bCompleted !== null) return -1;
    if (aCompleted !== null && bCompleted === null) return 1;

    return 0;
  });

  return sortedActivities;
};

const getUserParticipantActivities = async (userId: string, pagination: { skip: number, take: number }) => {
  return await ActivityRepository.getUserParticipantActivities(userId, pagination);
};

const getAllUserParticipantActivities = async (userId: string) => {
  return await ActivityRepository.getAllUserParticipantActivities(userId);
};

const getActivityParticipants = async (activityId: string) => {
  const participants = await ActivityRepository.getActivityParticipants(activityId);

  return participants.map((p) => ({
    id: p.id,
    activityId: p.activityId,
    userId: p.user.id,
    name: p.user.name,
    avatar: p.user.avatar,
    subscriptionStatus: p.approved ? 'Inscrito' : 'Pendente',
    confirmedAt: p.confirmedAt,
  }));
};

const getActivityById = async (id: string) => {
  return await ActivityRepository.getActivityById(id);
};

const createActivity = async (userId: string, data: any, file?: Express.Multer.File) => {
  let imageUrl = null;

  if (file) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      throw new Error('A imagem deve ser um arquivo PNG ou JPG.');
    }

    imageUrl = await uploadImage({
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer,
    }, 'activities');
  }

  const confirmationCode = generateToken(8);

  const activity = await ActivityRepository.createActivity(userId, {
    ...data,
    image: imageUrl,
    confirmationCode,
  });

  await grantAchievementIfNotExists(userId, 'Criou sua primeira atividade');
  return activity;
};

const subscribeActivity = async (userId: string, activityId: string) => {
  const activity = await ActivityRepository.getActivityById(activityId);
  if (!activity) throw new Error('Atividade não encontrada.');
  if (activity.completedAt) { throw new Error('Não é possível se inscrever em atividades concluídas.') };

  const existingSubscription = await ActivityRepository.getUserSubscription(userId, activityId);
  if (existingSubscription) {
    throw new Error('Você já se registrou nesta atividade.');
  }

  if (activity.creatorId === userId) {
    throw new Error('O criador da atividade não pode de se inscrever em sua própria atividade.');
  }

  const requiresApproval = activity.private;
  await grantAchievementIfNotExists(userId, 'Participou de sua primeira atividade');

  const subscription = await ActivityRepository.subscribeActivity(userId, activityId, requiresApproval);
  return subscription;
};

const updateActivity = async (userId: string, activityId: string, data: any) => {
  const activity = await ActivityRepository.getActivityById(activityId);

  if (!activity) {
    throw new Error('Atividade não encontrada.');
  }

  return await ActivityRepository.updateActivity(activityId, data);
};

const concludeActivity = async (userId: string, activityId: string) => {
  const activity = await ActivityRepository.getActivityById(activityId);

  if (!activity) {
    throw new Error('Atividade não encontrada');
  }

  if (activity.creatorId !== userId) {
    throw new Error('Apenas o criador pode concluir esta atividade.');
  }

  await grantAchievementIfNotExists(userId, 'Concluiu sua primeira atividade');
  return await ActivityRepository.concludeActivity(activityId);
};

const approveParticipant = async (userId: string, activityId: string, data: { participantId: string; approved: boolean }) => {
  const activity = await ActivityRepository.getActivityById(activityId);
  if (!activity || activity.creatorId !== userId) {
    throw new Error('Somente o criador pode aprovar a entrada de participantes.');
  }
  return await ActivityRepository.approveParticipant(activityId, data.participantId, data.approved);
}

const checkInActivity = async (userId: string, activityId: string, confirmationCode: string) => {
  const activity = await ActivityRepository.getActivityById(activityId);
  const participant = await ActivityRepository.getUserSubscription(userId, activityId);

  if (!participant || !participant.approved) {
    throw new Error('Você não pode fazer check-in sem aprovação.');
  }

  if (!activity) {
    throw new Error('Atividade não encontrada.');
  }

  if (activity.completedAt) {
    throw new Error('Não é possível fazer check-in em atividades concluídas.');
  }

  if (activity.confirmationCode !== confirmationCode.toUpperCase()) {
    throw new Error('Este código de confirmação não é válido.');
  }

  if (participant.confirmedAt) {
    throw new Error('Você já fez check-in nesta atividade.');
  }

  await ActivityRepository.checkInActivity(userId, activityId, confirmationCode.toUpperCase());
  await UserRepository.addXP(userId, XP_PER_CHECKIN);
  await UserRepository.addXP(activity.creatorId, XP_PER_CHECKIN / 2);
  await grantAchievementIfNotExists(userId, 'first-check-in');

  return { message: 'Check-in realizado com sucesso. XP adicionado.' };
};

const unsubscribeActivity = async (userId: string, activityId: string) => {
  const participant = await ActivityRepository.getUserSubscription(userId, activityId);
  if (!participant) {
    throw new Error('Você não se inscreveu nesta atividade.');
  }

  if (participant.confirmedAt !== null) {
    throw new Error('Você não pode cancelar a inscrição após confirmar sua presença.');
  }

  return await ActivityRepository.unsubscribeActivity(userId, activityId);
};

const deleteActivity = async (userId: string, activityId: string) => {
  const activity = await ActivityRepository.getActivityById(activityId);
  if (!activity || activity.creatorId !== userId) {
    throw new Error('Somente o criador pode excluir esta atividade.');
  }

  return await ActivityRepository.deleteActivity(activityId);
};

export {
  getActivityTypes,
  listActivities,
  listAllActivities,
  getUserCreatedActivities,
  getAllUserCreatedActivities,
  getUserParticipantActivities,
  getAllUserParticipantActivities,
  getActivityParticipants,
  getActivityById,
  createActivity,
  subscribeActivity,
  updateActivity,
  concludeActivity,
  approveParticipant,
  checkInActivity,
  unsubscribeActivity,
  deleteActivity
}