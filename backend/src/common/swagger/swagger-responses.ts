import { ApiResponse } from '@nestjs/swagger';

export const SwaggerResponses = {
  BadRequest: ApiResponse({
    status: 400,
    description: 'Dados de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['Campo obrigatório não informado'],
        error: 'Bad Request',
      },
    },
  }),

  Unauthorized: ApiResponse({
    status: 401,
    description: 'Token de acesso inválido ou não informado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Não autorizado',
        error: 'Unauthorized',
      },
    },
  }),

  Forbidden: ApiResponse({
    status: 403,
    description: 'Acesso negado - permissões insuficientes',
    schema: {
      example: {
        statusCode: 403,
        message: 'Acesso negado',
        error: 'Forbidden',
      },
    },
  }),

  NotFound: ApiResponse({
    status: 404,
    description: 'Recurso não encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Recurso não encontrado',
        error: 'Not Found',
      },
    },
  }),

  Conflict: ApiResponse({
    status: 409,
    description: 'Conflito - recurso já existe',
    schema: {
      example: {
        statusCode: 409,
        message: 'Este email já está em uso',
        error: 'Conflict',
      },
    },
  }),

  InternalServerError: ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
    schema: {
      example: {
        statusCode: 500,
        message: 'Erro interno do servidor',
        error: 'Internal Server Error',
      },
    },
  }),
};
