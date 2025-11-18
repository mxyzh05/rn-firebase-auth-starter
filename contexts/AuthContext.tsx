import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService, AuthResponse, LoginRequest, RegisterRequest, ResetPasswordRequest } from '@/services/authService';

// User interface
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
}

// Auth context state interface
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Auth context actions interface
interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

// Combined auth context interface
interface AuthContextType extends AuthState, AuthActions {}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Secure storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

// Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check authentication status from secure storage
   */
  const checkAuthStatus = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_KEY);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Verify token validity by fetching current user
        try {
          const currentUserData = await authService.getCurrentUser();
          if (currentUserData) {
            setUser(currentUserData.user);
            await SecureStore.setItemAsync(USER_KEY, JSON.stringify(currentUserData.user));
          }
        } catch (tokenError) {
          // Token is invalid, clear storage
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Store authentication data securely
   */
  const storeAuthData = async (authData: AuthResponse): Promise<void> => {
    if (!authData.data || !authData.data.token) {
      throw new Error('Invalid authentication data received');
    }

    try {
      await SecureStore.setItemAsync(TOKEN_KEY, authData.data.token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, authData.data.refreshToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authData.data.user));
      setUser(authData.data.user);
      setError(null);
    } catch (error) {
      throw new Error('Failed to store authentication data');
    }
  };

  /**
   * Clear authentication data
   */
  const clearAuthData = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  /**
   * Login user
   */
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse = await authService.login(credentials);

      if (authResponse.success && authResponse.data) {
        await storeAuthData(authResponse);
      } else {
        throw new Error(authResponse.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const authResponse = await authService.register(userData);

      if (authResponse.success && authResponse.data) {
        await storeAuthData(authResponse);
      } else {
        throw new Error(authResponse.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Call logout endpoint to invalidate token on server
      try {
        await authService.logout();
      } catch (error) {
        // Continue with local logout even if server call fails
        console.warn('Server logout failed:', error);
      }

      await clearAuthData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authService.resetPassword({ email });

      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh authentication token
   */
  const refreshToken = async (): Promise<void> => {
    try {
      const storedRefreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const authResponse = await authService.refreshToken(storedRefreshToken);

      if (authResponse.success && authResponse.data) {
        await storeAuthData(authResponse);
      } else {
        throw new Error(authResponse.message || 'Token refresh failed');
      }
    } catch (error) {
      // If refresh fails, clear auth data and redirect to login
      await clearAuthData();
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      setError(errorMessage);
      throw error;
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setError(null);
  };

  // Context value
  const value: AuthContextType = {
    // State
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    // Actions
    login,
    register,
    logout,
    resetPassword,
    refreshToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

/**
 * Hook to get authentication status only (state without actions)
 */
export function useAuthStatus(): {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
} {
  const { user, isLoading, isAuthenticated, error } = useAuth();
  return { user, isLoading, isAuthenticated, error };
}