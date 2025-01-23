import axios from 'axios';
import { ClientDashboardStats } from '../types/dashboard';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5079/api';

export const getDashboardStats = async (searchQuery?: string): Promise<ClientDashboardStats> => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const response = await axios.get<ClientDashboardStats>(
            `${API_URL}/ClientDashboard`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: searchQuery ? { searchQuery } : {}
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
        }
        throw error;
    }
};

export const updateItemStock = async (itemId: number, newQuantity: number): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication required');

    await axios.put(
        `${API_URL}/ClientDashboard/items/${itemId}/stock`,
        { newQuantity },
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );
};