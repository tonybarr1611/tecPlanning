import { createContext } from 'react';
import { User } from '../shared/types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, programCode: string, carne: string) => Promise<boolean>;
  updateProfile: (name: string, programCode: string, carne: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
