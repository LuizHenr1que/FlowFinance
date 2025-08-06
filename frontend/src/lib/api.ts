import axios, { AxiosInstance, AxiosError } from 'axios';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token && !config.url?.includes('/auth/login') && !config.url?.includes('/users')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor para handle de refresh token
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean };

        // Não interferir em rotas de autenticação
        if (originalRequest.url?.includes('/auth/login') || 
            originalRequest.url?.includes('/users') ||
            originalRequest.url?.includes('/auth/register')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (originalRequest.url?.includes('/auth/refresh')) {
            // Se o refresh falhou, limpar tudo e redirecionar
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          try {
            const newToken = await this.handleTokenRefresh();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await this.axiosInstance.post<RefreshResponse>('/auth/refresh', {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;

        // Atualizar tokens no localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        return access_token;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  async register(name: string, email: string, password: string): Promise<LoginResponse> {
    // Primeiro criar o usuário
    await this.axiosInstance.post('/users', {
      name,
      email,
      password,
    });
    
    // Depois fazer login automaticamente para obter os tokens
    const loginResponse = await this.axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    
    return loginResponse.data;
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.axiosInstance.post<{ message: string }>('/auth/logout');
    this.clearTokens();
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.axiosInstance.get<User>('/auth/profile');
    return response.data;
  }

  // User methods
  async getUsers(): Promise<User[]> {
    const response = await this.axiosInstance.get<User[]>('/user');
    return response.data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.axiosInstance.get<User>(`/user/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await this.axiosInstance.post<User>('/user', userData);
    return response.data;
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    const response = await this.axiosInstance.patch<User>(`/user/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await this.axiosInstance.delete<{ message: string }>(`/user/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export type { LoginResponse, RefreshResponse, ApiError, User, CreateUserData, UpdateUserData };
