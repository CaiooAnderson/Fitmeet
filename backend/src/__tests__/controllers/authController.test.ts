jest.mock('../../services/userService');
jest.mock('../../services/s3Service', () => ({
  createBucketIfNotExists: jest.fn().mockResolvedValue(undefined),
  uploadImage: jest.fn().mockResolvedValue('https://example.com/avatar.png'),
  bucketName: 'mock-bucket',
}));

import request from 'supertest';
import app from '../../server';
import * as UserService from '../../services/userService';

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

let originalConsoleError: typeof console.error;
let originalConsoleLog: typeof console.log;

beforeEach(() => {
  jest.clearAllMocks();

  originalConsoleError = console.error;
  originalConsoleLog = console.log;

  console.error = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.log = originalConsoleLog;
});

  describe('POST /auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      (UserService.register as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'Caio',
          email: 'caio@email.com',
          cpf: '12345678910',
          password: '123456'
        });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'Usuário criado com sucesso.' });
    });

    it('deve retornar erro 400 se os campos forem inválidos', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'caio@email.com'
        });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Informe os campos obrigatórios corretamente.' });
    });

    it('deve retornar erro 409 se o e-mail ou CPF já estiverem cadastrados', async () => {
      (UserService.register as jest.Mock).mockImplementation(() => {
        throw new Error('E-mail já cadastrado');
      });

      const res = await request(app)
        .post('/auth/register')
        .send({
          name: 'caio',
          email: 'caio@email.com',
          cpf: '12345678910',
          password: '123456'
        });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: 'O e-mail ou CPF informado já pertence a outro usuário.',
      });
    });
  });

  describe('POST /auth/sign-in', () => {
    it('deve autenticar e retornar token + dados do usuário', async () => {
      const mockUser = {
        id: '1',
        name: 'caio',
        email: 'caio@email.com',
        cpf: '12345678910',
        avatar: 'url',
        xp: 50,
        level: 2,
        achievements: []
      };

      (UserService.login as jest.Mock).mockResolvedValue({
        token: 'fake-jwt-token',
        user: mockUser
      });

      const res = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'caio@email.com',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token', 'fake-jwt-token');
      expect(res.body).toMatchObject(mockUser);
    });

    it('deve retornar 400 se dados forem inválidos', async () => {
      const res = await request(app)
        .post('/auth/sign-in')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Informe os campos obrigatórios corretamente.' });
    });

    it('deve retornar 401 se senha for incorreta', async () => {
      (UserService.login as jest.Mock).mockImplementation(() => {
        throw new Error('Senha inválida');
      });

      const res = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'caio@email.com',
          password: '1234567a'
        });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Senha incorreta.' });
    });

    it('deve retornar 403 se a conta estiver desativada', async () => {
      (UserService.login as jest.Mock).mockImplementation(() => {
        throw new Error('Conta desativada');
      });

      const res = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'caio@email.com',
          password: '123456'
        });

      expect(res.status).toBe(403);
      expect(res.body).toEqual({ error: 'Esta conta foi desativada e não pode ser utilizada.' });
    });

    it('deve retornar 404 se usuário não for encontrado', async () => {
      (UserService.login as jest.Mock).mockImplementation(() => {
        throw new Error('E-mail ou senha inválidos');
      });

      const res = await request(app)
        .post('/auth/sign-in')
        .send({
          email: 'caiofake@email.com',
          password: '123456'
        });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Usuário não encontrado.' });
    });
  });
});
