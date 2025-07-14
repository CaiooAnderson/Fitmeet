import request from 'supertest';
import app from '../../server';
import * as ActivityService from '../../services/activityService';
import * as UserService from '../../services/userService';
import * as UserRepository from '../../repositories/userRepository';
import { PrismaClient } from '@prisma/client';

jest.mock('../../services/userService');
jest.mock('../../repositories/userRepository');
jest.mock('@prisma/client');

type SubscribeActivityFn = (userId: string, activityId: string) => Promise<{
  activityId: string;
  userId: string;
  approved: boolean;
  confirmedAt: Date | null;
}>;

type UnsubscribeActivityFn = (userId: string, activityId: string) => Promise<{
  activityId: string;
  userId: string;
  approved: boolean;
  confirmedAt: Date | null;
}>;

type CheckInActivityFn = (userId: string, activityId: string, confirmationCode: string) => Promise<{ message: string }>;

jest.mock('../../services/activityService', () => ({
  getActivityTypes: jest.fn(),
  createActivity: jest.fn(),
  subscribeActivity: jest.fn(),
  updateActivity: jest.fn(),
  checkInActivity: jest.fn(),
  unsubscribeActivity: jest.fn() as jest.Mock<UnsubscribeActivityFn, [string, string]>,
  deleteActivity: jest.fn(),
  approveParticipant: jest.fn(),
  getActivityById: jest.fn(),
  getActivityParticipants: jest.fn(),
  determineUserSubscriptionStatus: jest.fn(),
}));

const mockedActivityService = ActivityService as jest.Mocked<typeof ActivityService>;

const prisma = new PrismaClient();

describe('ActivityController', () => {
  let mockUser: { id: string; deletedAt: Date | null } = { id: '123', deletedAt: null };

  beforeEach(() => {
    mockUser = {
      id: '123',
      deletedAt: null,
    };
    jest.clearAllMocks();
  });

  describe('GET /activities/types', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).get('/activities/types');
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Autenticação necessária.');
    });

    it('should return 403 if user is deactivated', async () => {
      mockUser.deletedAt = new Date();
      const response = await request(app).get('/activities/types').set('Authorization', 'Bearer validToken');
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Esta conta foi desativada e não pode ser utilizada.');
    });

    it('should return activity types on success', async () => {
      const mockTypes = [{ id: 1, name: 'Workshop' }];
      (ActivityService.getActivityTypes as jest.Mock).mockResolvedValue(mockTypes);

      const response = await request(app)
        .get('/activities/types')
        .set('Authorization', 'Bearer validToken')
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTypes);
    });

    it('should return 500 if there is an error', async () => {
      (ActivityService.getActivityTypes as jest.Mock).mockRejectedValue(new Error('Something went wrong'));

      const response = await request(app)
        .get('/activities/types')
        .set('Authorization', 'Bearer validToken')
        .send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro inesperado.');
    });
  });

  describe('POST /activities', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).post('/activities').send();
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Autenticação necessária.');
    });

    it('should return 400 if address is missing', async () => {
      const response = await request(app)
        .post('/activities')
        .set('Authorization', 'Bearer validToken')
        .send({ title: 'New Activity', description: 'Test Activity' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('O campo "address" é obrigatório.');
    });

    it('should return 400 if address is invalid JSON', async () => {
      const response = await request(app)
        .post('/activities')
        .set('Authorization', 'Bearer validToken')
        .send({ title: 'New Activity', description: 'Test Activity', address: 'invalid' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('O campo "address" deve ser um objeto JSON válido.');
    });

    it('should return 400 if latitude or longitude are invalid', async () => {
      const response = await request(app)
        .post('/activities')
        .set('Authorization', 'Bearer validToken')
        .send({ 
          title: 'New Activity', 
          description: 'Test Activity', 
          address: '{"latitude": "invalid", "longitude": "invalid"}' 
        });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Latitude e longitude devem ser números válidos.');
    });

    it('should return 201 if activity is created successfully', async () => {
      const mockActivity = {
        id: 1,
        title: 'New Activity',
        description: 'Test Activity',
        scheduledDate: '2025-01-01',
        typeId: 1,
        private: false,
        image: 'http://image.url',
        activityAddress: { latitude: 40.712776, longitude: -74.005974 },
        creator: { id: '1', name: 'John Doe', avatar: 'http://avatar.url' },
      };
      
      (ActivityService.createActivity as jest.Mock).mockResolvedValue(mockActivity);

      const response = await request(app)
        .post('/activities')
        .set('Authorization', 'Bearer validToken')
        .send({ 
          title: 'New Activity', 
          description: 'Test Activity', 
          address: '{"latitude": 40.712776, "longitude": -74.005974}', 
          scheduledDate: '2025-01-01',
          private: 'false'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: mockActivity.id,
        title: mockActivity.title,
        description: mockActivity.description,
        typeId: mockActivity.typeId,
        image: mockActivity.image,
        address: mockActivity.activityAddress,
        scheduledDate: mockActivity.scheduledDate,
        private: mockActivity.private,
        creator: { id: mockActivity.creator.id, name: mockActivity.creator.name, avatar: mockActivity.creator.avatar }
      });
    });

    it('should return 500 if there is an error', async () => {
      (ActivityService.createActivity as jest.Mock).mockRejectedValue(new Error('Something went wrong'));


      const response = await request(app)
        .post('/activities')
        .set('Authorization', 'Bearer validToken')
        .send({ 
          title: 'New Activity', 
          description: 'Test Activity', 
          address: '{"latitude": 40.712776, "longitude": -74.005974}',
          scheduledDate: '2025-01-01',
          private: 'false'
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro inesperado.');
    });
  });

  describe('POST /activities/:id/subscribe', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).post('/activities/1/subscribe');
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Autenticação necessária.');
    });

    it('should return 403 if user is deactivated', async () => {
      mockUser.deletedAt = new Date();
      const response = await request(app).post('/activities/1/subscribe').set('Authorization', 'Bearer validToken');
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Esta conta foi desativada e não pode ser utilizada.');
    });

    it('should return 404 if activity is not found', async () => {
      (ActivityService.subscribeActivity as jest.Mock).mockRejectedValue(new Error('Atividade não encontrada.'));
  
      const response = await request(app)
        .post('/activities/1/subscribe')
        .set('Authorization', 'Bearer validToken');
  
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Atividade não encontrada.');
    });

    it('should return 409 if user is already subscribed', async () => {
      (ActivityService.subscribeActivity as jest.Mock).mockRejectedValue(new Error('Você já se registrou nesta atividade.'));
      
      const response = await request(app)
        .post('/activities/1/subscribe')
        .set('Authorization', 'Bearer validToken');
      
      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Você já se registrou nesta atividade.');
    });

    it('should return 200 if activity subscription is successful', async () => {
      const mockSubscription = {
        activityId: '1',
        userId: '123',
        approved: true,
        confirmedAt: new Date(),
      };
  
      (ActivityService.subscribeActivity as jest.Mock).mockResolvedValue(mockSubscription);
  
      const response = await request(app)
        .post('/activities/1/subscribe')
        .set('Authorization', 'Bearer validToken');
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        subscriptionId: '1-123',
        subscriptionStatus: 'Inscrito',
        confirmedAt: mockSubscription.confirmedAt,
        userId: mockSubscription.userId,
      });
    });

    it('should return 500 if there is an error', async () => {
      (ActivityService.subscribeActivity as jest.Mock).mockRejectedValue(new Error('Something went wrong'));
  
      const response = await request(app)
        .post('/activities/1/subscribe')
        .set('Authorization', 'Bearer validToken');
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro inesperado.');
    });
  });

  describe('POST /activities/:id/check-in', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).post('/activities/1/check-in').send({ confirmationCode: 'ABC123' });
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Autenticação necessária.');
    });

    it('should return 400 if confirmationCode is missing', async () => {
      const response = await request(app).post('/activities/1/check-in').set('Authorization', 'Bearer validToken').send();
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Informe os campos obrigatórios corretamente.');
    });

    it('should return 400 if check-in is invalid', async () => {
      (ActivityService.checkInActivity as jest.Mock).mockRejectedValue(new Error('Você não pode fazer check-in em atividades concluídas.'));
      
      const response = await request(app)
        .post('/activities/1/check-in')
        .set('Authorization', 'Bearer validToken')
        .send({ confirmationCode: 'ABC123' });
  
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Você não pode fazer check-in em atividades concluídas.');
    });

    it('should return 200 if check-in is successful', async () => {
      const mockResponse = { message: 'Participação confirmada com sucesso.' };
      (ActivityService.checkInActivity as jest.Mock).mockResolvedValue(mockResponse);
  
      const response = await request(app)
        .post('/activities/1/check-in')
        .set('Authorization', 'Bearer validToken')
        .send({ confirmationCode: 'ABC123' });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Participação confirmada com sucesso.');
    });

    it('should return 500 if there is an error', async () => {
      (ActivityService.checkInActivity as jest.Mock).mockRejectedValue(new Error('Something went wrong'));
  
      const response = await request(app)
        .post('/activities/1/check-in')
        .set('Authorization', 'Bearer validToken')
        .send({ confirmationCode: 'ABC123' });
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro inesperado.');
    });
  });

  describe('POST /activities/:id/unsubscribe', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).post('/activities/1/unsubscribe').send();
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Autenticação necessária.');
    });

    it('should return 403 if user is deactivated', async () => {
      mockUser.deletedAt = new Date();
      const response = await request(app).post('/activities/1/unsubscribe').set('Authorization', 'Bearer validToken').send();
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Esta conta foi desativada e não pode ser utilizada.');
    });

    it('should return 404 if activity is not found', async () => {
      mockedActivityService.unsubscribeActivity.mockRejectedValue(new Error('Atividade não encontrada.'));

      const response = await request(app)
        .post('/activities/1/unsubscribe')
        .set('Authorization', 'Bearer validToken')
        .send();

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Atividade não encontrada.');
    });

    it('should return 409 if user is not subscribed to the activity', async () => {
      mockedActivityService.unsubscribeActivity.mockRejectedValue(new Error('Você não está inscrito nesta atividade.'));

      const response = await request(app)
        .post('/activities/1/unsubscribe')
        .set('Authorization', 'Bearer validToken')
        .send();

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Você não está inscrito nesta atividade.');
    });

    it('should return 200 if user unsubscribes successfully', async () => {
      mockedActivityService.unsubscribeActivity.mockResolvedValue({
        activityId: '1',
        userId: '123',
        approved: true,
        confirmedAt: new Date(),
      });

      const response = await request(app)
        .post('/activities/1/unsubscribe')
        .set('Authorization', 'Bearer validToken')
        .send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Participação cancelada com sucesso.');
    });

    it('should return 500 if there is an error', async () => {
      mockedActivityService.unsubscribeActivity.mockRejectedValue(new Error('Something went wrong'));

      const response = await request(app)
        .post('/activities/1/unsubscribe')
        .set('Authorization', 'Bearer validToken')
        .send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro inesperado.');
    });
  });

  describe('DELETE /activities/:id', () => {
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app).delete('/activities/1').send();
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Autenticação necessária.');
    });
  
    it('should return 404 if activity is not found', async () => {
      mockedActivityService.deleteActivity.mockResolvedValue(null as unknown as ReturnType<typeof ActivityService.deleteActivity>);
  
      const response = await request(app)
        .delete('/activities/1')
        .set('Authorization', 'Bearer validToken')
        .send();
  
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Atividade não encontrada.');
    });
  
    it('should return 200 if activity is deleted successfully', async () => {
      mockedActivityService.deleteActivity.mockResolvedValue({
        id: '1',
        title: 'Título de Teste',
        description: 'Descrição',
        image: null,
        typeId: 'type1',
        confirmationCode: 'ABC123',
        scheduledDate: new Date(),
        createdAt: new Date(),
        deletedAt: null,
        completedAt: null,
        private: false,
        creatorId: '123',
      });
  
      const response = await request(app)
        .delete('/activities/1')
        .set('Authorization', 'Bearer validToken')
        .send();
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Atividade excluída!');
    });
  
    it('should return 500 if there is an error', async () => {
      mockedActivityService.deleteActivity.mockRejectedValue(new Error('Something went wrong'));
  
      const response = await request(app)
        .delete('/activities/1')
        .set('Authorization', 'Bearer validToken')
        .send();
  
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erro inesperado.');
    });
  });
});