import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, ApiError } from "../lib/api";
import { User } from "../shared/types";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_STORAGE_KEY = "tecplanning_token";
const USER_STORAGE_KEY = "tecplanning_user";

const parseStoredUser = (): User | null => {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) {
    return null;
  }
  try {
    return JSON.parse(stored) as User;
  } catch (error) {
    console.error("Unable to parse stored user", error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const storeSession = useCallback((authToken: string, nextUser: User) => {
    setToken(authToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      const profile = await apiRequest<User>("/users/me", { token });
      setUser(profile);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to refresh user profile", error);
      clearSession();
      throw error;
    }
  }, [token, clearSession]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = parseStoredUser();

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    if (storedUser) {
      setUser(storedUser);
    }

    apiRequest<User>("/users/me", { token: storedToken })
      .then((profile) => {
        setUser(profile);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      })
      .catch((error) => {
        console.error("Session validation failed", error);
        clearSession();
      })
      .finally(() => setIsLoading(false));
  }, [clearSession]);

  const login = useCallback<AuthContextType["login"]>(async (email, password) => {
    try {
      const response = await apiRequest<{ token: string; user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      storeSession(response.token, response.user);
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      console.error("Login error", error);
      return false;
    }
  }, [storeSession]);

  const signup = useCallback<AuthContextType["signup"]>(
    async (name, email, password, programCode, carne) => {
      try {
        const response = await apiRequest<{ token: string; user: User }>("/auth/signup", {
          method: "POST",
          body: JSON.stringify({ name, email, password, programCode, carne }),
        });
        storeSession(response.token, response.user);
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          return false;
        }
        console.error("Signup error", error);
        return false;
      }
    },
    [storeSession],
  );

  const updateProfile = useCallback<AuthContextType["updateProfile"]>(
    async (name, programCode, carne) => {
      if (!token) {
        return false;
      }
      try {
        const updatedUser = await apiRequest<User>("/users/me", {
          method: "PUT",
          body: JSON.stringify({ name, programCode, carne }),
          token,
        });
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          return false;
        }
        console.error("Profile update error", error);
        return false;
      }
    },
    [token],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    signup,
    updateProfile,
    refreshUser,
    logout,
  }), [user, token, isLoading, login, signup, updateProfile, refreshUser, logout]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
