import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserType } from "../types/UserType";
import { AuthService } from "../api/services/AuthService";

interface AuthContextType {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    lastname: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay usuario autenticado al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Usuario no autenticado
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      // El backend puede devolver { user: UserType } o el UserType directamente
      const userFromResponse = (response as any)?.user ?? (response as any);
      setUser(userFromResponse as UserType);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string,
    lastname: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      // El backend devuelve el usuario directamente (sin estructura {user: ...})
      const userData = await AuthService.signup({
        name,
        lastname,
        email,
        password,
      });
      // Aceptar tanto { user: UserType } como UserType
      const normalized = (userData as any)?.user ?? (userData as any);
      setUser(normalized as UserType);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: UserType) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};
