import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('FlowFinance API (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Aplicar os mesmos pipes e configurações do main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validateCustomDecorators: true,
      }),
    );

    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Limpar dados de teste usando Prisma Client
    try {
      // Limpar apenas usuários, os refresh tokens serão limpos em cascata
      await prismaService.user.deleteMany({});
    } catch {
      // Ignorar erros se as tabelas não existirem ainda
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
  });

  describe('User Registration', () => {
    it('/users (POST) - should create a new user', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body.name).toBe(createUserDto.name);
      expect(response.body).not.toHaveProperty('password');
    });

    it('/users (POST) - should fail with invalid email', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'TestPassword123!',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('/users (POST) - should fail with weak password', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('/users (POST) - should fail when email already exists', async () => {
      const createUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      // Criar usuário pela primeira vez
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      // Tentar criar novamente com o mesmo email
      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(409);
    });
  });

  describe('Authentication', () => {
    beforeEach(async () => {
      // Criar um usuário para os testes de login
      const createUserDto = {
        name: 'Auth User',
        email: 'auth@example.com',
        password: 'TestPassword123!',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);
    });

    it('/auth/login (POST) - should login with valid credentials', async () => {
      const loginDto = {
        email: 'auth@example.com',
        password: 'TestPassword123!',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginDto.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('/auth/login (POST) - should fail with invalid email', async () => {
      const loginDto = {
        email: 'wrong@example.com',
        password: 'TestPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('/auth/login (POST) - should fail with invalid password', async () => {
      const loginDto = {
        email: 'auth@example.com',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('/auth/login (POST) - should fail with invalid email format', async () => {
      const loginDto = {
        email: 'invalid-email',
        password: 'TestPassword123!',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(400);
    });

    it('/auth/profile (GET) - should get user profile with valid token', async () => {
      // Fazer login para obter token
      const loginDto = {
        email: 'auth@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      const { access_token } = loginResponse.body;

      // Acessar perfil com token
      const profileResponse = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(profileResponse.body.email).toBe(loginDto.email);
      expect(profileResponse.body).toHaveProperty('id');
      expect(profileResponse.body).toHaveProperty('name');
    });

    it('/auth/profile (GET) - should fail without token', async () => {
      await request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('/auth/profile (GET) - should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('/auth/logout (POST) - should logout with valid token', async () => {
      // Fazer login para obter token
      const loginDto = {
        email: 'auth@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      const { access_token } = loginResponse.body;

      // Fazer logout
      const logoutResponse = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${access_token}`)
        .expect(200);

      expect(logoutResponse.body.message).toBe('Logout realizado com sucesso');
    });

    it('/auth/refresh (POST) - should refresh tokens with valid refresh token', async () => {
      // Fazer login para obter tokens
      const loginDto = {
        email: 'auth@example.com',
        password: 'TestPassword123!',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200);

      const { refresh_token } = loginResponse.body;

      // Usar refresh token para obter novos tokens
      const refreshResponse = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refresh_token })
        .expect(200);

      expect(refreshResponse.body).toHaveProperty('access_token');
      expect(refreshResponse.body).toHaveProperty('refresh_token');
      expect(refreshResponse.body).toHaveProperty('user');
    });
  });
});
