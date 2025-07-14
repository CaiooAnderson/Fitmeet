import * as ActivityService from '../../services/activityService';
import * as ActivityRepository from '../../repositories/activityRepository';
import * as UserRepository from '../../repositories/userRepository';
import { grantAchievementIfNotExists } from '../../repositories/userRepository';
import prisma from '../../orm/database';

jest.mock('../../repositories/activityRepository');
jest.mock('../../repositories/userRepository', () => ({
  ...jest.requireActual('../../repositories/userRepository'),
  addXP: jest.fn(),
  grantAchievementIfNotExists: jest.fn(),
}));

describe('ActivityService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActivityTypes', () => {
    it('deve retornar tipos de atividade do repositório', async () => {
      const mockTypes = [{ id: '1', name: 'Tipo A' }];
      (ActivityRepository.getActivityTypes as jest.Mock).mockResolvedValue(mockTypes);

      const result = await ActivityService.getActivityTypes();
      expect(result).toEqual(mockTypes);
      expect(ActivityRepository.getActivityTypes).toHaveBeenCalled();
    });
  });

  describe('getAllUserCreatedActivities', () => {
    it('deve ordenar concluídas por último', async () => {
      const activities = [
        { id: '1', completedAt: null },
        { id: '2', completedAt: new Date() },
        { id: '3', completedAt: null },
      ];

      (ActivityRepository.getAllUserCreatedActivities as jest.Mock).mockResolvedValue(activities);

      const sorted = await ActivityService.getAllUserCreatedActivities('user-id');
      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('3');
      expect(sorted[2].id).toBe('2');
    });
  });

  describe('checkInActivity', () => {
    const userId = 'user-id';
    const activityId = 'activity-id';
    const confirmationCode = 'ABC123';

    const activity = {
      id: activityId,
      creatorId: 'creator-id',
      completedAt: null,
      confirmationCode,
    };

    const participant = {
      approved: true,
      confirmedAt: null,
    };

    it('deve confirmar check-in corretamente', async () => {
      (ActivityRepository.getActivityById as jest.Mock).mockResolvedValue(activity);
      (ActivityRepository.getUserSubscription as jest.Mock).mockResolvedValue(participant);
      (ActivityRepository.checkInActivity as jest.Mock).mockResolvedValue({});

      const result = await ActivityService.checkInActivity(userId, activityId, confirmationCode);

      expect(result).toHaveProperty('message');
      expect(ActivityRepository.checkInActivity).toHaveBeenCalledWith(userId, activityId, confirmationCode);
      expect(UserRepository.addXP).toHaveBeenCalled();
      expect(grantAchievementIfNotExists).toHaveBeenCalledWith(userId, 'first-check-in');
    });

    it('deve lançar erro se já tiver confirmado', async () => {
      (ActivityRepository.getActivityById as jest.Mock).mockResolvedValue(activity);
      (ActivityRepository.getUserSubscription as jest.Mock).mockResolvedValue({ ...participant, confirmedAt: new Date() });

      await expect(
        ActivityService.checkInActivity(userId, activityId, confirmationCode)
      ).rejects.toThrow('Você já fez check-in nesta atividade.');
    });
  });
});
