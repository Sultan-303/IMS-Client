import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi } from '../api/auth';
import { LoginRequest } from '../types/auth';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginApi(credentials);
          set({ token: response.token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Invalid credentials', isLoading: false });
          throw error;
        }
      },
      logout: () => set({ token: null, isAuthenticated: false, error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);