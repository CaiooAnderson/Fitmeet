import prisma from '../orm/database';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

const getActivityTypes = async () => {
  return await prisma.activityTypes.findMany();
}

const listActivities = async (query: any, skip: number, take: number) => {
  const { typeId, orderBy, order } = query;

  const where: Prisma.ActivitiesWhereInput = {
    deletedAt: null,
    completedAt: null,
    ...(typeId && { typeId }),
  };

  const orderClause: Prisma.ActivitiesOrderByWithRelationInput = orderBy
    ? {
        [orderBy]: order === 'desc' ? 'desc' : 'asc',
      }
    : {
        createdAt: 'desc',
      };

      return await prisma.activities.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          scheduledDate: true,
          createdAt: true,
          completedAt: true,
          private: true,
          creatorId: true,
          type: {
            select: {
              name: true
            }
          },
          activityAddress: {
            select: {
              latitude: true,
              longitude: true
            }
          },
          confirmationCode: true
        },
        skip,
        take,
        orderBy: orderClause,
      });
};

const listActivitiesByTypes = async (typeIds: string[], skip: number, take: number) => {
  return await prisma.activities.findMany({
    where: {
      typeId: {
        in: typeIds,
      },
      deletedAt: null,
      completedAt: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      scheduledDate: true,
      createdAt: true,
      completedAt: true,
      private: true,
      creatorId: true,
      confirmationCode: true,
      type: {
        select: {
          name: true
        }
      },
      activityAddress: {
        select: {
          latitude: true,
          longitude: true
        }
      }
    },
    skip,
    take,
  });
};

const listAllActivities = async (filters: { typeId?: string, orderBy?: string, order?: string }) => {
  return await prisma.activities.findMany({
    where: {
      deletedAt: null,
      completedAt: null,
      ...(filters.typeId ? { typeId: filters.typeId } : {}),
    },
    orderBy: {
      [filters.orderBy || 'createdAt']: filters.order === 'desc' ? 'desc' : 'asc',
    },
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      confirmationCode: true,
      scheduledDate: true,
      createdAt: true,
      completedAt: true,
      private: true,
      creatorId: true,
      type: {
        select: {
          name: true
        }
      },
      activityAddress: {
        select: {
          latitude: true,
          longitude: true
        }
      }
    }
  });
};

const listAllActivitiesByTypes = async (typeIds: string[], orderBy?: string, order?: string) => {
  const orderClause: Prisma.ActivitiesOrderByWithRelationInput = orderBy
    ? { [orderBy]: order === 'desc' ? 'desc' : 'asc' }
    : { createdAt: 'desc' };

  return await prisma.activities.findMany({
    where: {
      typeId: { in: typeIds },
      deletedAt: null,
      completedAt: null,
    },
    orderBy: orderClause,
    include: { type: true },
  });
};

const getUserCreatedActivities = async (
  userId: string,
  pagination: { skip: number; take: number }
) => {
  const baseWhere = { creatorId: userId, deletedAt: null };

  const notCompleted = await prisma.activities.findMany({
    where: {
      ...baseWhere,
      completedAt: null,
    },
    include: {
      activityAddress: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const completed = await prisma.activities.findMany({
    where: {
      ...baseWhere,
      completedAt: { not: null },
    },
    include: {
      activityAddress: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const allOrdered = [...notCompleted, ...completed];
  const paginated = allOrdered.slice(pagination.skip, pagination.skip + pagination.take);

  return paginated;
};

const getAllUserCreatedActivities = async (userId: string) => {
  return await prisma.activities.findMany({
    where: { creatorId: userId, deletedAt: null },
    include: { type: true, activityAddress: true },
  });
};

const getUserParticipantActivities = async (userId: string, pagination: { skip: number, take: number }) => {
  return await prisma.activityParticipants.findMany({
    where: {
      userId,
      activity: {
        deletedAt: null,
      },
    },
    include: {
      activity: {
        include: {
          type: true,
          participants: true,
          activityAddress: true,
          creator: true,
        },
      },
    },
    orderBy: [
      {
        activity: {
          createdAt: 'desc'
        },
      },
      {
        activity: {
          completedAt: 'asc'
        }
      }
    ],
    skip: pagination.skip,
    take: pagination.take,
  });
};

const getAllUserParticipantActivities = async (userId: string) => {
  return await prisma.activityParticipants.findMany({
    where: { userId },
    include: { 
      activity: {
        include: { 
          type: true, 
          participants: true, 
          activityAddress: true, 
          creator: true,
        },
      },
    },
    orderBy: {
      activity: {
        completedAt: 'desc',
      },
    },
  });
};

const getActivityParticipants = async (activityId: string) => {
  return await prisma.activityParticipants.findMany({
    where: { activityId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
};

const getActivityById = async (activityId: string) => {
  return await prisma.activities.findUnique({
    where: { id: activityId },
  });
}

const createActivity = async (userId: string, data: any) => {
  const confirmationCode = cuid().toUpperCase().slice(0, 10);

  const { address, ...rest } = data;

  return await prisma.activities.create({
    data: {
      ...rest,
      creatorId: userId,
      confirmationCode,
      scheduledDate: new Date(data.scheduledDate),
      activityAddress: {
        create: {
          latitude: address.latitude,
          longitude: address.longitude,
        },
      },
    },
    include: {
      creator: true,
      activityAddress: true,
    },
  });
};

const subscribeActivity = async (userId: string, activityId: string, requiresApproval: boolean) => {
  const confirmedAtValue = !requiresApproval ? new Date() : null;
  const subscription = await prisma.activityParticipants.create({
    data: { 
      userId, 
      activityId, 
      approved: !requiresApproval,
      confirmedAt: confirmedAtValue
    },
    select: {
      userId: true,
      activityId: true,
      approved: true,
      confirmedAt: true,
    }
  });

  return subscription;
};

const getUserSubscription = async (userId: string, activityId: string) => {
  return await prisma.activityParticipants.findUnique({
    where: { activityId_userId: { activityId, userId } },
  });
}

const updateActivity = async (activityId: string, data: any) => {
  const { address, ...rest } = data;

  return await prisma.activities.update({
    where: { id: activityId },
    data: {
      ...rest,
      activityAddress: address ? {
        update: {
          latitude: address.latitude,
          longitude: address.longitude
        }
      } : undefined
    }
  });
};

const concludeActivity = async (activityId: string) => {
  return await prisma.activities.update({
    where: { id: activityId },
    data: { completedAt: new Date() },
  });
}

const approveParticipant = async (activityId: string, participantId: string, approved: boolean) => {
  const result = await prisma.activityParticipants.updateMany({
    where: {
      activityId,
      userId: participantId,
    },
    data: { approved },
  });

  if (result.count === 0) {
    throw new Error('Participante não encontrado');
  }
};

const checkInActivity = async (userId: string, activityId: string, confirmationCode: string) => {
  const activity = await prisma.activities.findUnique({ where: { id: activityId } });

  if (!activity) throw new Error('Atividade não encontrada.');
  if (activity.confirmationCode !== confirmationCode) throw new Error('Este código de confirmação não é válido.');

  return await prisma.activityParticipants.update({
    where: {
      activityId_userId: { activityId, userId },
    },
    data: { confirmedAt: new Date() },
  });
};

const unsubscribeActivity = async (userId: string, activityId: string) => {
  return await prisma.activityParticipants.delete({
    where: {
      activityId_userId: { activityId, userId },
    },
  });
};

const deleteActivity = async (activityId: string) => {
  return await prisma.activities.update({
    where: { id: activityId },
    data: { deletedAt: new Date() },
  });
};

export {
  getActivityTypes,
  listActivities,
  listActivitiesByTypes,
  listAllActivities,
  listAllActivitiesByTypes,
  getUserCreatedActivities,
  getAllUserCreatedActivities,
  getUserParticipantActivities,
  getAllUserParticipantActivities,
  getActivityParticipants,
  getActivityById,
  createActivity,
  subscribeActivity,
  getUserSubscription,
  updateActivity,
  concludeActivity,
  approveParticipant,
  checkInActivity,
  unsubscribeActivity,
  deleteActivity
};
