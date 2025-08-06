import React from 'react';

const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo/Brand */}
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground font-bold text-xl">F</span>
        </div>
        
        {/* Loading Animation */}
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">FlowFinance</p>
          <p className="text-sm text-muted-foreground mt-1">Verificando autenticação...</p>
        </div>
        
        {/* Progress dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
