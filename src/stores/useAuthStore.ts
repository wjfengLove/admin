import { create } from 'zustand';
import type { UserInfo } from '@/types/user';

interface AuthState {
  token: string | null;
  user: UserInfo | null;
  setAuth: (token: string, user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,

  setAuth: (token: string, user: UserInfo) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
