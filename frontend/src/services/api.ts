import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3001',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - adiciona o token a todas as requisições
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - trata refresh token automaticamente
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Se já estamos renovando o token, enfileira a requisição
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.api(originalRequest);
              })
              .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken(refreshToken);
            const { access_token, refresh_token } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // Processa todas as requisições enfileiradas
            this.failedQueue.forEach(({ resolve }) => resolve(access_token));
            this.failedQueue = [];

            // Refaz a requisição original
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Se falhou ao renovar, limpa tudo e redireciona para login
            this.failedQueue.forEach(({ reject }) => reject(refreshError));
            this.failedQueue = [];
            
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            
            window.location.href = '/login';
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AxiosResponse<LoginResponse>> {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<AxiosResponse<{ user: User }>> {
    return this.api.post('/users', userData);
  }

  async refreshToken(refreshToken: string): Promise<AxiosResponse<RefreshTokenResponse>> {
    return this.api.post('/auth/refresh', { refreshToken });
  }

  async logout(): Promise<AxiosResponse<{ message: string }>> {
    return this.api.post('/auth/logout');
  }

  async getProfile(): Promise<AxiosResponse<User>> {
    return this.api.get('/auth/profile');
  }

  // Método para fazer requisições autenticadas
  async authenticatedRequest<T>(config: any): Promise<AxiosResponse<T>> {
    return this.api(config);
  }
}

export const apiService = new ApiService();
export default apiService;
