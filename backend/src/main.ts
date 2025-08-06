import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // CORS Configuration
  app.enableCors({
    origin: true, // Aceita qualquer origem temporariamente para teste
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('FlowFinance API')
    .setDescription(
      'API de gestão financeira do FlowFinance - Sistema completo para controle de finanças pessoais e empresariais',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT no formato: Bearer <token>',
      },
      'access-token',
    )
    .addTag('auth', 'Operações de autenticação')
    .addTag('users', 'Operações de usuário')
    .addTag('transactions', 'Operações de transações')
    .addTag('accounts', 'Operações de contas')
    .addTag('categories', 'Operações de categorias')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'FlowFinance API Documentation',
    customfavIcon: '/favicon.ico',
  });

  logger.log(
    '📖 Swagger documentation available at: http://localhost:3001/api/docs',
  );

  const port = 3001;
  await app.listen(port, '0.0.0.0');

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
void bootstrap();
