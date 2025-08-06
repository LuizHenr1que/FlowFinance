import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        message: 'Credenciais inválidas',
        error: 'INVALID_CREDENTIALS',
        statusCode: HttpStatus.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      {
        message: 'Email já está em uso',
        error: 'USER_ALREADY_EXISTS',
        statusCode: HttpStatus.CONFLICT,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class ValidationException extends HttpException {
  constructor(errors: string[]) {
    super(
      {
        message: 'Dados de entrada inválidos',
        error: 'VALIDATION_ERROR',
        statusCode: HttpStatus.BAD_REQUEST,
        details: errors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
