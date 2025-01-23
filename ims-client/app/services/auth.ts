import api from './api';
import { LoginRequest, LoginResponse, User } from '../types/auth';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/Auth/login', credentials);
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/Auth/me');
        return response.data;
    },
};