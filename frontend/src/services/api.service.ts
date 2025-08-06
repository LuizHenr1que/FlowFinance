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
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
}

export const apiService = new ApiService();
