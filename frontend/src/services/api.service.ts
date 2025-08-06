const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    error: string;
    details?: string[];
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private baseUrl = API_BASE_URL;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log('🔗 API Request URL:', url);
      console.log('📦 API Request Options:', options);
      
      const token = localStorage.getItem('access_token');

      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      console.log('⚙️ Final config:', config);

      const response = await fetch(url, config);
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Response data:', data);
        return { data };
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Error data:', errorData);
        
        // Se for erro 401 (não autorizado), o token pode ter expirado
        if (response.status === 401) {
          console.log('🔓 Token expirado, removendo sessão');
          this.removeToken();
          // Recarregar a página para forçar o redirecionamento para login
          window.location.href = '/login';
          return {
            error: {
              message: 'Sessão expirada. Faça login novamente.',
              statusCode: 401,
              error: 'UNAUTHORIZED',
            },
          };
        }
        
        return {
          error: {
            message: errorData.message || 'Erro na requisição',
            statusCode: response.status,
            error: errorData.error || 'REQUEST_ERROR',
            details: errorData.details,
          },
        };
      }
    } catch (error) {
      console.error('🚨 Network Error:', error);
      return {
        error: {
          message: 'Erro de conexão com o servidor',
          statusCode: 0,
          error: 'NETWORK_ERROR',
        },
      };
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  removeToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // User data management
  setUserData(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserData(): User | null {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      // Verificar se tem as propriedades básicas necessárias
      if (parsed && parsed.id && parsed.email && parsed.name) {
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
      return null;
    }
  }

  // Verificar se há uma sessão válida
  hasValidSession(): boolean {
    const token = this.getToken();
    const user = this.getUserData();
    return !!(token && user);
  }
}

export const apiService = new ApiService();
