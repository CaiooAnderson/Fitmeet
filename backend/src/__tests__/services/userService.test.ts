import * as UserService from '../../services/userService';
import * as UserRepository from '../../repositories/userRepository';
import * as ActivityRepository from '../../repositories/activityRepository';
import * as s3Service from '../../services/s3Service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../repositories/userRepository');
jest.mock('../../repositories/activityRepository');
jest.mock('../../services/s3Service');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  const mockUser = {
    id: 'user-id',
    name: 'caio',
    email: 'caio@example.com',
    cpf: '12345678910',
    password: 'hashed-password',
    xp: 0,
    level: 0,
    deletedAt: null,
    userAchievements: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar novo usuário', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserRepository.findByCPF as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (s3Service.getDefaultAvatarUrl as jest.Mock).mockResolvedValue('default-url');
      (UserRepository.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.register({
        name: 'caio',
        email: 'caio@example.com',
        cpf: '12345678910',
        password: 'senha123',
      });

      expect(result).toEqual(mockUser);
    });

    it('deve lançar erro se email já estiver cadastrado', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(UserService.register({
        name: 'caio',
        email: mockUser.email,
        cpf: mockUser.cpf,
        password: 'senha',
      })).rejects.toThrow('E-mail já cadastrado');
    });
  });

  describe('login', () => {
    it('deve logar com sucesso', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('fake-token');

      const result = await UserService.login(mockUser.email, 'senha');

      expect(result.token).toBe('fake-token');
      expect(result.user.email).toBe(mockUser.email);
    });

    it('deve lançar erro se senha estiver incorreta', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(UserService.login(mockUser.email, 'wrong')).rejects.toThrow('Senha inválida');
    });
  });

  describe('getUserPreferences', () => {
    it('deve retornar preferências filtradas', async () => {
      const preferences = [{ typeId: '1' }];
      const types = [{ id: '1', name: 'Corrida', description: 'Atividade física' }];
      (UserRepository.findPreferencesByUserId as jest.Mock).mockResolvedValue(preferences);
      (ActivityRepository.getActivityTypes as jest.Mock).mockResolvedValue(types);

      const result = await UserService.getUserPreferences('user-id');
      expect(result).toEqual([{ id: '1', name: 'Corrida', description: 'Atividade física' }]);
    });
  });

  describe('defineUserPreferences', () => {
    it('deve atualizar preferências válidas', async () => {
      (ActivityRepository.getActivityTypes as jest.Mock).mockResolvedValue([{ id: '1' }, { id: '2' }]);
      await UserService.defineUserPreferences('user-id', ['1', '2']);
      expect(UserRepository.updatePreferences).toHaveBeenCalled();
    });

    it('deve lançar erro para ID inválido', async () => {
      (ActivityRepository.getActivityTypes as jest.Mock).mockResolvedValue([{ id: '1' }]);
      await expect(UserService.defineUserPreferences('user-id', ['3'])).rejects.toThrow('Um ou mais IDs informados são inválidos.');
    });
  });

  describe('addXP', () => {
    it('deve adicionar XP e subir de nível', async () => {
      const user = { ...mockUser, xp: 90, level: 0 };
      (UserRepository.findById as jest.Mock).mockResolvedValue(user);
      (UserRepository.update as jest.Mock).mockResolvedValue({});
      (UserRepository.grantAchievement as jest.Mock).mockResolvedValue({});

      await UserService.addXP(user.id, 20);

      expect(UserRepository.update).toHaveBeenCalledWith(user.id, { xp: 110, level: 1 });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar dados e retornar novo usuário', async () => {
      (UserRepository.findById as jest.Mock).mockResolvedValue(mockUser);
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserRepository.update as jest.Mock).mockResolvedValue({});
      (UserRepository.findById as jest.Mock).mockResolvedValueOnce(mockUser);

      await UserService.updateUser(mockUser.id, { name: 'Novo nome' });
      expect(UserRepository.update).toHaveBeenCalled();
    });
  });

  describe('grantAchievement', () => {
    it('deve conceder conquista', async () => {
      await UserService.grantAchievement('user-id', 'achv-id');
      expect(UserRepository.grantAchievement).toHaveBeenCalledWith('user-id', 'achv-id');
    });
  });
});
