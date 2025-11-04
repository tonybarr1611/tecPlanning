import React, { useState, useEffect, ReactNode } from 'react';
import { User, StoredUser } from '../shared/types';
import { AuthContext } from './AuthContext.ts';
import type { AuthContextType } from './AuthContext.ts';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const storedUser = localStorage.getItem('tecplanning_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get stored users from localStorage
      const storedUsers = localStorage.getItem('tecplanning_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Find user with matching email and password
      const foundUser = users.find((u: StoredUser) => u.email === email && u.password === password);

      if (foundUser) {
        const userToStore: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          program: foundUser.program,
          carne: foundUser.carne
        };
        
        setUser(userToStore);
        localStorage.setItem('tecplanning_user', JSON.stringify(userToStore));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, program: string, carne: string): Promise<boolean> => {
    try {
      // Get existing users
      const storedUsers = localStorage.getItem('tecplanning_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already exists
      if (users.some((u: StoredUser) => u.email === email)) {
        return false; // Email already exists
      }

      // Check if carné already exists
      if (users.some((u: StoredUser) => u.carne === carne)) {
        return false; // Carné already exists
      }

      // Create new user
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        program,
        carne
      };

      // Add to users array
      users.push(newUser);
      localStorage.setItem('tecplanning_users', JSON.stringify(users));

      // Log in the new user
      const userToStore: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        program: newUser.program,
        carne: newUser.carne
      };
      
      setUser(userToStore);
      localStorage.setItem('tecplanning_user', JSON.stringify(userToStore));
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const updateProfile = async (name: string, program: string, carne: string): Promise<boolean> => {
    try {
      if (!user) return false;

      // Get existing users
      const storedUsers = localStorage.getItem('tecplanning_users');
      const users: StoredUser[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if carné already exists for another user
      const existingCarneUser = users.find((u: StoredUser) => u.carne === carne && u.id !== user.id);
      if (existingCarneUser) {
        return false; // Carné already exists for another user
      }

      // Update user in users array
      const userIndex = users.findIndex((u: StoredUser) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], name, program, carne };
        localStorage.setItem('tecplanning_users', JSON.stringify(users));
      }

      // Update current user
      const updatedUser: User = {
        ...user,
        name,
        program,
        carne
      };
      
      setUser(updatedUser);
      localStorage.setItem('tecplanning_user', JSON.stringify(updatedUser));
      
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tecplanning_user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    updateProfile,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};