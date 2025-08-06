import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { InvalidCredentialsException } from './exceptions/auth.exceptions';
import { LoginResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
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
}
