import { create } from 'zustand';
import Cookies from 'js-cookie';
import authFetch from '@/utils/authFetch';

export const useUserStore = create((set) => ({
  user: null,
  isAuthorized: false,
  login: async (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      Cookies.set('access_token', token, { path: '/' });
    }
    const response = await authFetch('/api/api/user');
    const data = await response.json();
    console.log('data', data.data);
    set({ user: data.data, isAuthorized: true });
  },
  fetchUser: async () => {
    const response = await authFetch('/api/api/user');
    const data = await response.json();
    set({ user: data.data });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      Cookies.remove('access_token', { path: '/' });
    }
    set({ isAuthorized: false, user: null });
  },
  checkAuth: () => {
    const token = typeof window !== 'undefined' && localStorage.getItem('access_token');
    set({ isAuthorized: !!token });
  }
}));
