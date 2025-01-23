import axios from 'axios';

// Use local debug API (5079) for development database
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.CI === 'true';
const baseURL = isDevelopment 
    ? 'http://localhost:5079/api'    // Local API with Dev DB
    : 'http://localhost:5079/api';   // Docker API with Prod DB

console.log(`Starting application using API: ${baseURL}`);

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;