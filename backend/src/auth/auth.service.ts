import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResult, LoginResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthResult> {
    try {
      this.logger.log(`Tentativa de validação para usuário: ${email}`);

      const user = await this.usersService.findByEmail(email);

      if (!user) {
        this.logger.warn(`Usuário não encontrado: ${email}`);
        return { success: false, error: 'User not found' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(`Senha inválida para usuário: ${email}`);
        return { success: false, error: 'Invalid password' };
      }

      this.logger.log(`Usuário validado com sucesso: ${email}`);

      // Remove senha do retorno
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error(`Erro na validação do usuário ${email}:`, error);
      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  async login(user: any): Promise<LoginResponse> {
    try {
      this.logger.log(`Gerando tokens para usuário: ${user.email}`);

      const payload = {
        email: user.email,
        sub: user.id,
        name: user.name,
      };

      const accessToken = this.jwtService.sign(payload);

      const refreshToken = await this.generateRefreshToken(user.id);

      this.logger.log(`Tokens gerados com sucesso para usuário: ${user.email}`);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      this.logger.error(
        `Erro ao gerar tokens para usuário ${user.email}:`,
        error,
      );
      throw new Error('Token generation failed');
    }
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshTokenPayload = { sub: userId, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn:
        this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    // Calcular data de expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Salvar no banco
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return refreshToken;
  }

  // Validar e renovar tokens
  async refreshTokens(refreshToken: string): Promise<LoginResponse> {
    try {
      // Verificar se o refresh token existe e não foi revogado
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (
        !storedToken ||
        storedToken.isRevoked ||
        new Date() > storedToken.expiresAt
      ) {
        throw new UnauthorizedException('Refresh token inválido ou expirado');
      }

      // Verificar o JWT
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Revogar o refresh token usado
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { isRevoked: true },
      });

      // Gerar novos tokens
      const user = storedToken.user;
      return await this.login(user);
    } catch (error) {
      this.logger.error('Erro ao renovar tokens:', error);
      throw new UnauthorizedException('Não foi possível renovar os tokens');
    }
  }

  // Logout - revogar refresh tokens
  // Validar usuário pelo ID (usado pelo JWT Strategy)
  async validateUserById(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    return user;
  }

  async logout(userId: string): Promise<{ message: string }> {
    // Revogar todos os refresh tokens do usuário
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });

    return { message: 'Logout realizado com sucesso' };
  }
}
