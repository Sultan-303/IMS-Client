import axios from 'axios';
import { LoginRequest, LoginResponse } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
};