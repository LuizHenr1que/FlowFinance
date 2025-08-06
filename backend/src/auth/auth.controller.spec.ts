import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InvalidCredentialsException } from './exceptions/auth.exceptions';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
    logout: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLoginResponse = {
    access_token: 'access-token',
    refresh_token: 'refresh-token',
    user: {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return tokens when credentials are valid', async () => {
      mockAuthService.validateUser.mockResolvedValue({
        success: true,
        user: mockUser,
      });
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should throw InvalidCredentialsException when credentials are invalid', async () => {
      mockAuthService.validateUser.mockResolvedValue({
        success: false,
        user: null,
      });

      await expect(controller.login(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    const refreshTokenDto: RefreshTokenDto = {
      refresh_token: 'refresh-token',
    };

    it('should return new tokens when refresh token is valid', async () => {
      mockAuthService.refreshTokens.mockResolvedValue(mockLoginResponse);

      const result = await controller.refreshTokens(refreshTokenDto);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        refreshTokenDto.refresh_token,
      );
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('logout', () => {
    it('should return success message when logout is successful', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);
      const userId = '1';

      const result = await controller.logout(userId);

      expect(authService.logout).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ message: 'Logout realizado com sucesso' });
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const user = {
        userId: '1',
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = controller.getProfile(user);

      expect(result).toEqual({
        id: user.userId,
        email: user.email,
        name: user.name,
      });
    });
  });
});
