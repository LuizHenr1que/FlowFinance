# FlowFinance Backend - Testes

Este documento descreve a implementação de testes unitários e e2e para o backend do FlowFinance.

## Estrutura de Testes

### Testes Unitários
- **AuthService**: Testa validação de usuários, login, logout e refresh tokens
- **AuthController**: Testa endpoints de autenticação
- **UserService**: Testa criação e busca de usuários
- **UserController**: Testa endpoint de criação de usuário

### Testes E2E (End-to-End)
- **Health Check**: Testa endpoint básico de saúde
- **User Registration**: Testa criação de usuários com validações
- **Authentication**: Testa login, perfil, logout e refresh de tokens

## Executar Testes

### Todos os testes unitários
```bash
npm run test
```

### Testes unitários com coverage
```bash
npm run test:cov
```

### Testes em modo watch
```bash
npm run test:watch
```

### Testes e2e
```bash
npm run test:e2e
```

### Teste específico
```bash
npm run test -- auth.service.spec.ts
```

## Configuração

### Jest para Testes Unitários
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": ["**/*.(t|j)s"],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}
```

### Jest para Testes E2E
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

## Dependências de Teste

- **@nestjs/testing**: Módulo de teste do NestJS
- **jest**: Framework de testes
- **supertest**: Biblioteca para testes HTTP
- **@types/supertest**: Tipos TypeScript para Supertest

## Mocks e Fixtures

### AuthService Mock
```typescript
const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
  refreshTokens: jest.fn(),
  logout: jest.fn(),
};
```

### PrismaService Mock
```typescript
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};
```

## Cobertura de Testes

### Testes Implementados ✅

#### AuthService
- ✅ Validação de usuário com credenciais válidas
- ✅ Falha quando usuário não encontrado
- ✅ Falha quando senha inválida
- ✅ Geração de tokens no login
- ✅ Revogação de tokens no logout

#### AuthController
- ✅ Login com credenciais válidas
- ✅ Exceção para credenciais inválidas
- ✅ Refresh de tokens
- ✅ Logout bem-sucedido
- ✅ Obtenção de perfil

#### UserService
- ✅ Busca de usuário por email
- ✅ Criação de usuário
- ✅ Exceção para email já existente

#### UserController
- ✅ Criação de usuário

#### E2E Tests
- ✅ Health check
- ✅ Registro de usuário (sucesso e falhas)
- ✅ Login (sucesso e falhas)
- ✅ Perfil do usuário
- ✅ Logout
- ⚠️ Refresh tokens (problema com tokens duplicados)

## Status dos Testes

### Testes Unitários: ✅ 21/21 PASSING
### Testes E2E: ⚠️ 13/14 PASSING (1 problema conhecido)

## Problemas Conhecidos

1. **Refresh Token Duplicado**: O teste de refresh token falha ocasionalmente devido a tokens JWT idênticos gerados muito rapidamente. Isso pode ser resolvido adicionando um timestamp ou UUID ao payload do JWT.

## Próximos Passos

1. Corrigir o problema do refresh token duplicado
2. Adicionar testes para casos edge mais específicos
3. Implementar testes de integração para outros módulos
4. Adicionar testes de performance
5. Configurar CI/CD com execução automática de testes
