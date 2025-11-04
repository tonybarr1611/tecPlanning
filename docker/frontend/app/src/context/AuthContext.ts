import { createContext } from 'react';
import { User } from '../shared/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, program: string, carne: string) => Promise<boolean>;
  updateProfile: (name: string, program: string, carne: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);