import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// API Response Types
export interface AuthResponse {
  success: boolean;
  data?: {
    user: {
      uid: string;
      email: string;
      displayName?: string;
      emailVerified: boolean;
    };
    token: string;
    refreshToken: string;
  };
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    // Configure base URL from environment variables
    const baseURL = Constants.expoConfig?.extra?.apiBaseUrl || process.env.API_BASE_URL || 'http://localhost:8080/api';

    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        // Handle token expiration
        if (error.response?.status === 401) {
          await this.handleTokenExpiration();
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  // Get stored token from secure storage
  private async getStoredToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      return token;
    } catch {
      return null;
    }
  }

  // Handle token expiration
  private async handleTokenExpiration(): Promise<void> {
    // This will be implemented in the auth context
    console.warn('Token expired');
  }

  // Format API errors
  private formatError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    } else if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    } else if (error.code === 'NETWORK_ERROR') {
      return new Error('Network error. Please check your connection.');
    } else if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout. Please try again.');
    } else {
      return new Error('An unexpected error occurred. Please try again.');
    }
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(emailData: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/reset-password', emailData);
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Logout user (invalidate token on server)
   */
  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/logout');
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/verify-email', {
        token,
      });
      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<AuthResponse['data']> {
    try {
      const response = await this.api.get<AuthResponse>('/auth/me');
      return response.data.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }
}

// Create and export singleton instance
export const authService = new AuthService();

// Export class for testing purposes
export { AuthService };