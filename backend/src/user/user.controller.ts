import {
  Body,
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Registra um novo usuário no sistema.',
  })
  @ApiBody({ type: CreateUserDto, description: 'Dados para criar o usuário' })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: '123',
        email: 'novo@exemplo.com',
        name: 'Novo Usuário',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiConflictResponse({ description: 'Email já está em uso' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
