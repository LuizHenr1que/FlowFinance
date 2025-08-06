import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { AuthResult, LoginResponse } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
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
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      });

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
}
