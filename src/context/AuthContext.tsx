
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/user';
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";
import {toast} from "sonner";
import {setCookie} from "@/utils/CookieManagement";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (
      name: string,
      phone: string,
      email: string,
      password: string,
      termsAndConditionsAccepted: boolean,
      role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);

    try {
      toast.promise(axiosInstance.post('auth/login', { email, password }), {
        loading: 'Loading...',
        success: (response) => {
          console.log(response?.data);
          localStorage.setItem('user', JSON.stringify(response?.data.data));
          setUser(response?.data.data);
          setCookie("accessToken", response?.data.data.accessToken);
          return response?.data.message;
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            return error.response?.data.message;
          }
          else {
            return "Something went wrong. Please try again later.";
          }
        },
      });
    } finally {
      setIsLoading(false);
    }

    // setUser(mockUser);
    // localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (
      name: string,
      phone: string,
      email: string,
      password: string,
      termsAndConditionsAccepted: boolean,
      role: UserRole
  ) => {
    setIsLoading(true);

    try {
      toast.promise(axiosInstance.post('auth/register', { name, phone, email, password, termsAndConditionsAccepted, role }), {
        loading: 'Loading...',
        success: (response) => {
          console.log(response?.data);
          return response?.data.message;
        },
        error: (error) => {
          if (axios.isAxiosError(error)) {
            return error.response?.data.message;
          }
          else {
            return "Something went wrong. Please try again later.";
          }
        },
      });

      return true;
    } finally {
      setIsLoading(false);
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
