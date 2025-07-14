jest.mock('../../services/userService');
jest.mock('../../services/s3Service', () => ({
  createBucketIfNotExists: jest.fn().mockResolvedValue(undefined),
  uploadImage: jest.fn().mockResolvedValue('https://s3-bucket/avatar.png'),
  bucketName: 'mock-bucket',
}));

import request from 'supertest';
import app from '../../server';
import * as UserService from '../../services/userService';
import * as s3Service from '../../services/s3Service';
import jwt from 'jsonwebtoken';

const mockUser = {
  id: 'user-id-123',
  name: 'caio',
  email: 'caio@email.com',
  cpf: '12345678910',
  avatar: 'https://fake-avatar.com/avatar.png',
  xp: 0,
  level: 1,
  deletedAt: null,
  userAchievements: [{ achievement: { id: 'a1', name: 'Conquista 1' } }],
};

const token = jwt.sign({ id: mockUser.id, email: mockUser.email }, process.env.SECRET_KEY!, {
  expiresIn: '1h',
});

const authHeader = { Authorization: `Bearer ${token}` };

describe('userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /user', () => {
    it('deve retornar dados do usuário autenticado', async () => {
      (UserService.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const res = await request(app).get('/user').set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'caio');
      expect(res.body).not.toHaveProperty('password');
    });

    it('deve retornar 401 se não autenticado', async () => {
      const res = await request(app).get('/user');
      expect(res.status).toBe(401);
    });

    it('deve retornar 403 se conta desativada', async () => {
      (UserService.getUser as jest.Mock).mockResolvedValueOnce({ ...mockUser, deletedAt: new Date() });

      const res = await request(app).get('/user').set(authHeader);
      expect(res.status).toBe(403);
    });
  });

  describe('GET /user/preferences', () => {
    it('deve retornar preferências do usuário', async () => {
      const preferences = [{ typeId: '1' }, { typeId: '2' }];
      (UserService.getUser as jest.Mock).mockResolvedValue(mockUser);
      (UserService.getUserPreferences as jest.Mock).mockResolvedValue(preferences);

      const res = await request(app).get('/user/preferences').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(preferences);
    });
  });

  describe('PUT /user/avatar', () => {
    it('deve atualizar avatar do usuário', async () => {
      (UserService.getUser as jest.Mock).mockResolvedValue(mockUser);
      (s3Service.uploadImage as jest.Mock).mockResolvedValue('https://s3-bucket/avatar.png');
      (UserService.updateUserAvatar as jest.Mock).mockResolvedValue(undefined);
  
      const res = await request(app)
        .put('/user/avatar')
        .set(authHeader)
        .attach('avatar', Buffer.from('imagem falsa'), {
          filename: 'avatar.png',
          contentType: 'image/png',
        });
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ avatarUrl: 'https://s3-bucket/avatar.png' });
    });
  });
  
  describe('PUT /user/update', () => {
    it('deve atualizar dados do usuário', async () => {
      (UserService.getUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (UserService.updateUser as jest.Mock).mockResolvedValue(undefined);
      (UserService.getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const res = await request(app)
        .put('/user/update')
        .send({ name: 'Novo Nome' })
        .set(authHeader);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('caio');
    });
  });

  describe('DELETE /user/deactivate', () => {
    it('deve desativar usuário com sucesso', async () => {
      (UserService.getUser as jest.Mock).mockResolvedValue(mockUser);
      (UserService.deactivateUser as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete('/user/deactivate').set(authHeader);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Conta desativada com sucesso.');
    });
  });
});