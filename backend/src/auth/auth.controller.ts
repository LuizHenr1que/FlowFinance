import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { InvalidCredentialsException } from './exceptions/auth.exceptions';
import { LoginResponse } from './interfaces/auth.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Fazer login no sistema',
    description:
      'Autentica um usuário com email e senha, retornando tokens de acesso e refresh.',
  })
  @ApiBody({ type: LoginDto, description: 'Dados de login do usuário' })
  @ApiOkResponse({
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123',
          email: 'usuario@exemplo.com',
          name: 'Nome do Usuário',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos' })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const authResult = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!authResult.success || !authResult.user) {
      throw new InvalidCredentialsException();
    }

    return this.authService.login(authResult.user);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({
    summary: 'Renovar tokens de acesso',
    description: 'Gera novos tokens usando o refresh token válido.',
  })
  @ApiBody({ type: RefreshTokenDto, description: 'Token de refresh' })
  @ApiOkResponse({
    description: 'Tokens renovados com sucesso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123',
          email: 'usuario@exemplo.com',
          name: 'Nome do Usuário',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Token de refresh inválido' })
  @ApiUnauthorizedResponse({ description: 'Token expirado ou inválido' })
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginResponse> {
    return this.authService.refreshTokens(refreshTokenDto.refresh_token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Fazer logout do sistema',
    description: 'Invalida os tokens do usuário, realizando logout.',
  })
  @ApiOkResponse({
    description: 'Logout realizado com sucesso',
    schema: {
      example: {
        message: 'Logout realizado com sucesso',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou expirado' })
  async logout(
    @GetCurrentUser('userId') userId: string,
  ): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: 'Logout realizado com sucesso' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Obter perfil do usuário',
    description: 'Retorna as informações do perfil do usuário autenticado.',
  })
  @ApiOkResponse({
    description: 'Perfil do usuário',
    schema: {
      example: {
        id: '123',
        email: 'usuario@exemplo.com',
        name: 'Nome do Usuário',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou expirado' })
  getProfile(@GetCurrentUser() user: any) {
    return {
      id: user.userId,
      email: user.email,
      name: user.name,
    };
  }
}
