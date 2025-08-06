import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAlreadyExistsException } from '../auth/exceptions/auth.exceptions';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly HASH_ROUNDS = 12;

  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    try {
      this.logger.log(`Tentativa de criação de usuário: ${data.email}`);

      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        this.logger.warn(
          `Tentativa de registro com email já existente: ${data.email}`,
        );
        throw new UserAlreadyExistsException();
      }

      const hashedPassword = await bcrypt.hash(data.password, this.HASH_ROUNDS);

      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      this.logger.log(`Usuário criado com sucesso: ${user.email}`);
      return user;
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) {
        throw error;
      }

      this.logger.error(`Erro ao criar usuário ${data.email}:`, error);
      throw new Error('User creation failed');
    }
  }

  async findByEmail(email: string) {
    try {
      this.logger.log(`Buscando usuário por email: ${email}`);

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        this.logger.log(`Usuário encontrado: ${email}`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário por email ${email}:`, error);
      return null;
    }
  }

  async findById(id: string) {
    try {
      this.logger.log(`Buscando usuário por ID: ${id}`);

      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (user) {
        this.logger.log(`Usuário encontrado por ID: ${id}`);
      }

      return user;
    } catch (error) {
      this.logger.error(`Erro ao buscar usuário por ID ${id}:`, error);
      return null;
    }
  }
}
