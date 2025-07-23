import { Request, Response } from 'express';
import * as ActivityService from '../services/activityService';
import { UserSubscriptionStatus } from '../services/activityService';
import * as UserService from '../services/userService';
import { getSignedActivityImageUrl, uploadImage } from '../services/s3Service';
import * as UserRepository from '../repositories/userRepository';
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, bucketName } from "../services/s3Service";
import { getSignedAvatarUrl, getDefaultAvatarUrl } from "../services/s3Service";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const prisma = new PrismaClient();

export const getActivityTypes = async (req: AuthenticatedRequest, res: Response) => {
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

    const types = await ActivityService.getActivityTypes();

    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const listActivities = async (req: AuthenticatedRequest, res: Response) => {
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

    const userId = req.user.id;

    const page = parseInt(req.query.page as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 5;
    const skip = page * pageSize;

    const activities = await ActivityService.listActivities(userId, {
      ...req.query,
      skip,
      take: pageSize,
    });

    let totalActivities = 0;

    if (req.query.typeId) {
      totalActivities = await prisma.activities.count({
        where: {
          deletedAt: null,
          completedAt: null,
          typeId: String(req.query.typeId),
        },
      });
    } else {
      const preferences = await UserRepository.findPreferencesByUserId(userId);
      const preferredTypes = preferences.map((pref) => pref.typeId);

      totalActivities = await prisma.activities.count({
        where: {
          deletedAt: null,
          completedAt: null,
          typeId: { in: preferredTypes },
        },
      });
    }

    const totalPages = Math.ceil(totalActivities / pageSize);

    const response = {
      page,
      pageSize,
      totalActivities,
      totalPages,
      previous: page > 0 ? page - 1 : null,
      next: page < totalPages - 1 ? page + 1 : null,
      activities: await Promise.all(activities.map(async (activity) => {
        const creator = await prisma.users.findUnique({
          where: { id: activity.creatorId },
          select: {
            name: true,
            avatar: true,
          },
        });

        const participantCount = await prisma.activityParticipants.count({
          where: { activityId: activity.id, approved: true },
        });

        const userSubscriptionStatus = await ActivityService.determineUserSubscriptionStatus(userId, activity.id);
        const isCreator = userId === activity.creatorId;

        let signedImageUrl = null;
        if (activity.image) {
          signedImageUrl = await getSignedActivityImageUrl(activity.image);
        }
        
        return {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          type: activity.type.name,
          image: signedImageUrl,
          ...(isCreator && { confirmationCode: activity.confirmationCode }),
          participantCount,
          address: activity.activityAddress ? {
            latitude: activity.activityAddress.latitude,
            longitude: activity.activityAddress.longitude,
          } : null,
          scheduledDate: activity.scheduledDate,
          createdAt: activity.createdAt,
          completedAt: activity.completedAt,
          private: activity.private,
          creator: {
            id: activity.creatorId,
            name: creator ? creator.name : 'Nome não disponível',
            avatar: creator ? creator.avatar : 'default-avatar-url',
          },
          userSubscriptionStatus
        };
      })
    ),
  };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar atividades:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const listAllActivities = async (req: AuthenticatedRequest, res: Response) => {
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

    const userId = req.user.id;
    const { typeId, orderBy, order } = req.query;

    const activities = await ActivityService.listAllActivities(userId, {
      typeId: typeId ? String(typeId) : undefined,
      orderBy: orderBy ? String(orderBy) : 'createdAt',
      order: order ? String(order) : 'desc',
    });

    const response = await Promise.all(
      activities.map(async (activity) => {
        const creator = await prisma.users.findUnique({
          where: { id: activity.creatorId },
          select: { name: true, avatar: true },
        });

        const participantCount = await prisma.activityParticipants.count({
          where: { activityId: activity.id, approved: true },
        });

        const userSubscriptionStatus = await ActivityService.determineUserSubscriptionStatus(userId, activity.id);

        const isCreator = userId === activity.creatorId;

        let signedImageUrl = null;
        if (activity.image) {
          signedImageUrl = await getSignedActivityImageUrl(activity.image);
        }

        const baseActivity: Record<string, any> = {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          image: signedImageUrl,
          type: activity.type.name,
          scheduledDate: activity.scheduledDate,
          createdAt: activity.createdAt,
          completedAt: activity.completedAt,
          private: activity.private,
          address: activity && 'activityAddress' in activity && activity.activityAddress
            ? {
              latitude: activity.activityAddress.latitude,
              longitude: activity.activityAddress.longitude,
              }
            : { latitude: null, longitude: null },
          creator: {
            id: activity.creatorId,
            name: creator?.name ?? 'Nome não disponível',
            avatar: creator?.avatar ?? 'default-avatar-url',
          },
          participantCount,
          userSubscriptionStatus,
        };

        if (isCreator) {
          baseActivity.confirmationCode = activity.confirmationCode;
        }

        return baseActivity;
      })
    );

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao listar todas as atividades:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const getUserCreatedActivities = async (req: AuthenticatedRequest, res: Response) => {
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

    const page = parseInt(req.query.page as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 0;
    const skip = page * pageSize;

    const activities = await ActivityService.getUserCreatedActivities(req.user.id, {
      skip,
      take: pageSize,
    });

    const totalActivities = await prisma.activities.count({
      where: { creatorId: req.user.id },
    });

    const totalPages = Math.ceil(totalActivities / pageSize);

    const activitiesWithSignedImage = await Promise.all(
      activities.map(async (activity) => {
        let signedImageUrl = null;

        if (activity.image) {
          const key = activity.image;
          const command = new GetObjectCommand({ Bucket: bucketName, Key: key });

          try {
            signedImageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
          } catch (err) {
            console.error(`Erro ao gerar URL assinada para ${key}:`, err);
          }
        }

        return {
          ...activity,
          image: signedImageUrl,
        };
      })
    );

    const response = {
      page,
      pageSize,
      totalActivities,
      totalPages,
      previous: page > 0 ? page - 1 : null,
      next: page < totalPages - 1 ? page + 1 : null,
      activities: activitiesWithSignedImage,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar atividades criadas pelo usuário:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const getAllUserCreatedActivities = async (req: AuthenticatedRequest, res: Response) => {
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

    const activities = await ActivityService.getAllUserCreatedActivities(req.user.id);

    const activitiesWithStatus = await Promise.all(activities.map(async (activity) => {
      return {
        ...activity,
      };
    }));

    res.status(200).json(activitiesWithStatus);
  } catch (error) {
    console.error('Erro ao buscar todas as atividades criadas pelo usuário:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const getUserParticipantActivities = async (req: AuthenticatedRequest, res: Response) => {
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

    const page = parseInt(req.query.page as string) || 0;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const skip = page * pageSize;

    const activities = await ActivityService.getUserParticipantActivities(req.user.id, {
      skip,
      take: pageSize,
    });

    const totalActivities = await prisma.activityParticipants.count({
      where: {
        userId: req.user.id,
        activity: {
          deletedAt: null,
          completedAt: null,
        },
      },
    });

    const totalPages = Math.ceil(totalActivities / pageSize);

    const response = {
      page,
      pageSize,
      totalActivities,
      totalPages,
      previous: page > 0 ? page - 1 : null,
      next: page < totalPages - 1 ? page + 1 : null,
      activities: await Promise.all(activities.map(async (participant) => {
        const activity = participant.activity;

        const creatorAvatar = activity.creator.avatar;
        let signedAvatarUrl = null;

        if (creatorAvatar?.includes(bucketName)) {
          const key = creatorAvatar.split(`/${bucketName}/`)[1];
          if (key) {
            const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
            signedAvatarUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
          }
        }

        let signedActivityImageUrl = null;
        if (activity.image?.includes(bucketName)) {
          const key = activity.image.split(`/${bucketName}/`)[1];
          if (key) {
            const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
            signedActivityImageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
          }
        }

        return {
          id: activity.id,
          title: activity.title,
          description: activity.description,
          type: activity.type.name,
          image: signedActivityImageUrl ?? null,
          confirmationCode: activity.confirmationCode,
          participantCount: activity.participants.length,
          address: {
            latitude: activity.activityAddress.latitude,
            longitude: activity.activityAddress.longitude,
          },
          scheduledDate: activity.scheduledDate,
          createdAt: activity.createdAt,
          completedAt: activity.completedAt,
          private: activity.private,
          creator: {
            id: activity.creatorId,
            name: activity.creator.name,
            avatar: signedAvatarUrl ?? null,
          },
        };
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao buscar atividades do participante:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const getAllUserParticipantActivities = async (req: AuthenticatedRequest, res: Response) => {
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

    const activities = await ActivityService.getAllUserParticipantActivities(req.user!.id);

    const response = await Promise.all(activities.map(async (activity) => {
      const userSubscriptionStatus = await ActivityService.determineUserSubscriptionStatus(
        req.user!.id,
        activity.activity.id
      );

      const avatarKey = activity.activity.creator.avatar?.split(`/${bucketName}/`)[1];
      let signedAvatarUrl = null;

      if (avatarKey) {
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: avatarKey,
        });
        signedAvatarUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      }

      return {
        id: activity.activity.id,
        title: activity.activity.title,
        description: activity.activity.description,
        type: activity.activity.type.name,
        image: activity.activity.image,
        confirmationCode: activity.activity.confirmationCode,
        participantCount: activity.activity.participants.length,
        address: activity.activity.activityAddress
          ? {
              latitude: activity.activity.activityAddress.latitude,
              longitude: activity.activity.activityAddress.longitude,
            }
          : null,
        scheduledDate: activity.activity.scheduledDate,
        createdAt: activity.activity.createdAt,
        completedAt: activity.activity.completedAt,
        private: activity.activity.private,
        creator: {
          id: activity.activity.creatorId,
          name: activity.activity.creator.name,
          avatar: activity.activity.creator.avatar || 'default-avatar-url',
        },
        userSubscriptionStatus,
      };
    }));

    res.status(200).json(response);
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'Autenticação necessária.') {
      res.status(401).json({ error: message });
      return;
    }

    if (message === 'Esta conta foi desativada e não pode ser utilizada.') {
      res.status(403).json({ error: message });
      return;
    }

    console.error('Erro inesperado ao listar todas as atividades que o usuário participa:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const getActivityParticipants = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

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

    const activity = await ActivityService.getActivityById(id);
    if (!activity) {
      res.status(404).json({ error: 'Atividade não encontrada.' });
      return;
    }

    const participants = await ActivityService.getActivityParticipants(id);

    if (!participants) {
      res.status(404).json({ error: 'Atividade não encontrada.' });
      return;
    }

    res.status(200).json(participants);
  } catch (error) {
    console.error('Erro ao buscar participantes da atividade:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const createActivity = async (req: AuthenticatedRequest, res: Response) => {
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

    const { title, description, typeId, scheduledDate, private: isPrivate } = req.body;

    if (!req.body.address) {
      res.status(400).json({ error: 'O campo "address" é obrigatório.' });
      return;
    }

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(req.body.address);
    } catch (error) {
      res.status(400).json({ error: 'O campo "address" deve ser um objeto JSON válido.' });
      return;
    }

    const { latitude, longitude } = parsedAddress;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      res.status(400).json({ error: 'Latitude e longitude devem ser números válidos.' });
      return;
    }

    let imageUrl = null;

    if (req.file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(req.file.mimetype.toLowerCase())) {
        res.status(400).json({ error: 'A imagem deve ser um arquivo PNG ou JPG.' });
        return
      }

      imageUrl = await uploadImage(
        {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          buffer: req.file.buffer,
        },
        'activities'
      );
    }

    const activityData = {
      ...req.body,
      private: isPrivate === 'true',
      scheduledDate: new Date(scheduledDate),
      image: imageUrl,
      address: {
        latitude,
        longitude
      }
    };

    const createdActivity = await ActivityService.createActivity(req.user.id, activityData, req.file);

    let signedImageUrl = null;
    if (createdActivity.image?.includes(bucketName)) {
      const key = createdActivity.image.split(`/${bucketName}/`)[1];
      if (key) {
        const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
        signedImageUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      }
    }

    const response = {
      id: createdActivity.id,
      title: createdActivity.title,
      description: createdActivity.description,
      typeId: createdActivity.typeId,
      image: signedImageUrl,
      address: {
        latitude: createdActivity.activityAddress?.latitude,
        longitude: createdActivity.activityAddress?.longitude,
      },
      scheduledDate: createdActivity.scheduledDate,
      createdAt: createdActivity.createdAt,
      completedAt: createdActivity.completedAt,
      private: createdActivity.private,
      ...(createdActivity.private && { confirmationCode: createdActivity.confirmationCode }),
      creator: {
        id: createdActivity.creator.id,
        name: createdActivity.creator.name,
        avatar: createdActivity.creator.avatar,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'A imagem deve ser um arquivo PNG ou JPG.') {
      res.status(400).json({ error: message });
      return;
    }
    
    console.error('Erro ao criar atividade:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const subscribeActivity = async (req: AuthenticatedRequest, res: Response) => {
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

    const subscription = await ActivityService.subscribeActivity(req.user.id, req.params.id);

    const subscriptionStatus = subscription.approved
      ? UserSubscriptionStatus.Inscrito
      : UserSubscriptionStatus.Pendente;

    res.status(200).json({
      subscriptionId: `${subscription.activityId}-${subscription.userId}`,
      subscriptionStatus,
      confirmedAt: subscription.confirmedAt,
      userId: subscription.userId,
    });
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'Atividade não encontrada.') {
      res.status(404).json({ error: 'Atividade não encontrada.' });
      return;
    }

    if (message === 'Você já se registrou nesta atividade.') {
      res.status(409).json({ error: 'Você já se registrou nesta atividade.' });
      return;
    }

    console.error(error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const updateActivity = async (req: AuthenticatedRequest, res: Response) => {
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

    const { title, description, typeId, address, scheduledDate, private: isPrivate } = req.body;
    const imageFile = req.file;

    let parsedAddress;
    if (address) {
      try {
        parsedAddress = JSON.parse(address);
      } catch (error) {
        res.status(400).json({ error: 'O campo "address" deve ser um objeto JSON válido.' });
        return;
      }
    }

    const activityData = {
      title,
      description,
      typeId,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      private: req.body.private === 'true' ? true
             : req.body.private === 'false' ? false
             : undefined,
      image: imageFile ? await uploadImage(imageFile, 'activities') : undefined,
      address: address ? (() => {
        try {
          const parsed = JSON.parse(address);
          return { latitude: parsed.latitude, longitude: parsed.longitude };
        } catch {
          return undefined;
        }
      })() : undefined
    };

    const updatedActivity = await ActivityService.updateActivity(req.user.id, req.params.id, activityData);

    const activityWithDetails = await prisma.activities.findUnique({
      where: { id: updatedActivity.id },
      include: {
        activityAddress: true,
        creator: { 
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    if (!activityWithDetails) {
      res.status(404).json({ error: 'Atividade não encontrada.' });
      return;
    }

    const response = {
      id: activityWithDetails.id,
      title: activityWithDetails.title,
      description: activityWithDetails.description,
      typeId: activityWithDetails.typeId,
      image: activityWithDetails.image,
      address: activityWithDetails.activityAddress ? {
        latitude: activityWithDetails.activityAddress.latitude,
        longitude: activityWithDetails.activityAddress.longitude,
      } : null,
      scheduledDate: activityWithDetails.scheduledDate,
      createdAt: activityWithDetails.createdAt,
      completedAt: activityWithDetails.completedAt,
      private: activityWithDetails.private,
      creator: {
        id: activityWithDetails.creator.id,
        name: activityWithDetails.creator.name,
        avatar: activityWithDetails.creator.avatar || 'default-avatar-url',
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const message = (error as Error).message;

    if (message === 'Atividade não encontrada.') {
      res.status(404).json({ error: message });
      return;
    }
    
    console.error(error);
    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const concludeActivity = async (req: AuthenticatedRequest, res: Response) => {
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

    await ActivityService.concludeActivity(req.user.id, req.params.id);

    res.status(200).json({ message: 'Atividade concluída com sucesso.' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Atividade não encontrada') {
        res.status(404).json({ error: 'Atividade não encontrada.' });
      } else {
        res.status(500).json({ error: 'Erro inesperado.' });
      }
    } else {
      res.status(500).json({ error: 'Erro inesperado.' });
    }
  }
};

export const approveParticipant = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) throw new Error('Autenticação necessária.');

    const participantId = req.body.participantId;
    await ActivityService.approveParticipant(req.user.id, req.params.id, {
      participantId,
      approved: req.body.approved,
    });

    res.status(200).json({ message: 'Solicitação de participação aprovada com sucesso.' });

  } catch (error: any) {
    if (error instanceof Error) {
      const message = error.message;

      if (message === 'Autenticação necessária.') {
        res.status(401).json({ error: 'Autenticação necessária.' });
        return
      }
      if (message === 'Conta desativada') {
        res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
        return
      }
      if (message === 'Participante não encontrado') {
        res.status(404).json({ error: 'Participante não encontrado.' });
        return
      }
    }

    if (error?.code === 'P2023') {
      res.status(400).json({ error: 'Informe os campos obrigatórios corretamente.' });
      return
    }

    console.error('Erro ao aprovar participante:', error);
    res.status(500).json({ error: 'Erro inesperado.' });
    return
  }
};

export const checkInActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const confirmationCode = req.body.confirmationCode;

    if (!confirmationCode) {
      res.status(400).json({ error: 'Informe os campos obrigatórios corretamente.' });
      return;
    }

    await ActivityService.checkInActivity(req.user.id, req.params.id, confirmationCode.toUpperCase());

    res.status(200).json({ message: 'Participação confirmada com sucesso.' });
  } catch (error) {
    if (error instanceof Error) {
      const msg = error.message;

      switch (msg) {
        case 'Autenticação necessária.':
          res.status(401).json({ error: msg });
          return;

        case 'Conta desativada':
          res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
          return;

        case 'Atividade não encontrada.':
          res.status(404).json({ error: msg });
          return;

        case 'Você já fez check-in nesta atividade.':
          res.status(409).json({ error: msg });
          return;

        case 'Você não pode fazer check-in sem aprovação.':
        case 'Não é possível fazer check-in em atividades concluídas.':
        case 'Este código de confirmação não é válido.':
          res.status(400).json({ error: msg });
          return;

        default:
          console.error('Erro inesperado no check-in:', error);
          res.status(500).json({ error: 'Erro inesperado.' });
          return;
      }
    }

    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const unsubscribeActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    await ActivityService.unsubscribeActivity(req.user.id, req.params.id);

    res.status(200).json({ message: 'Participação cancelada com sucesso.' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Atividade não encontrada') {
        res.status(404).json({ error: 'Atividade não encontrada.' });
        return;
      }

      if (error.message === 'Conta desativada') {
        res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
        return;
      }

      if (error.message === 'Você não está inscrito nesta atividade.') {
        res.status(409).json({ error: 'Você não está inscrito nesta atividade.' });
        return;
      }
    }

    res.status(500).json({ error: 'Erro inesperado.' });
  }
};

export const deleteActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Autenticação necessária.' });
      return;
    }

    const result = await ActivityService.deleteActivity(req.user.id, req.params.id);

    if (!result) {
      res.status(404).json({ error: 'Atividade não encontrada.' });
      return;
    }

    res.status(200).json({ message: 'Atividade excluída!' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === 'Conta desativada') {
        res.status(403).json({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
        return;
      }

      res.status(500).json({ error: 'Erro inesperado.' });
    } else {
      res.status(500).json({ error: 'Erro inesperado.' });
    }
  }
};