"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Indicador de carga inicial 
  });

  useEffect(() => {
    // Simular persistencia de sesión 
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setState({ user: JSON.parse(savedUser), isAuthenticated: true, isLoading: false });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string) => {
    setState(prev => ({ ...prev, isLoading: true })); // Mostrar loading 
    
    // Simulación de llamada a API [cite: 2]
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = { id: '1', email, name: 'Usuario Demo' };
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setState({ user: mockUser, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};