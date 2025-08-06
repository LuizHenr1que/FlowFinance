import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, User, LoginResponse } from '../lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
  // Verificar se já tem dados no localStorage para inicializar mais rapidamente
  const hasStoredSession = () => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    return !!(token && userData);
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(hasStoredSession());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Verificar se há sessão salva no localStorage
        const token = localStorage.getItem('access_token');
        const userDataStr = localStorage.getItem('user');
        
        console.log('🔍 Verificando sessão salva...');
        
        if (token && userDataStr) {
          console.log('✅ Sessão encontrada, fazendo login automático');
          const userData = JSON.parse(userDataStr) as User;
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          console.log('📝 Nenhuma sessão encontrada');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await apiService.login(email, password);
      
      // Salvar tokens e dados do usuário
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro de conexão. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await apiService.register(name, email, password);
      
      // Salvar tokens e dados do usuário
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro de conexão. Tente novamente.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await apiService.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
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