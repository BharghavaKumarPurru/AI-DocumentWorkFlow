import { LoginCredentials, AuthResponse } from '../types/auth';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5094/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid username or password');
    }

    const data = await response.json();

    // Store the token and role based on the "rememberMe" preference
    if (credentials.rememberMe) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('role', data.user.role); // Save role
    } else {
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('role', data.user.role); // Save role
    }

    return data;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('role');
  },

  isAuthenticated(): boolean {
    return !!(localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token'));
  },

  getRole(): string | null {
    return localStorage.getItem('role') || sessionStorage.getItem('role');
  },
};
