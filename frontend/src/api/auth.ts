import api from './client';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  skills: string[];
  bio: string | null;
  location: string | null;
  education: any[];
  experience: any[];
  is_active: boolean;
  created_at: string;
}

export const authAPI = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};
