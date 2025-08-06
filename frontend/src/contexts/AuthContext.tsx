import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, LoginRequest, RegisterRequest, User } from '@/services/api.service';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar se há sessão salva no localStorage
    const token = apiService.getToken();
    const userData = apiService.getUserData();
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(userData);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.login(credentials);
      
      if (response.data) {
        // Salvar tokens e dados do usuário
        apiService.setToken(response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        apiService.setUserData(response.data.user);
        
        setIsAuthenticated(true);
        setUser(response.data.user);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Erro desconhecido ao fazer login' 
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: 'Erro de conexão. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiService.register(userData);
      
      if (response.data) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error?.message || 'Erro desconhecido ao criar conta' 
        };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        error: 'Erro de conexão. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};