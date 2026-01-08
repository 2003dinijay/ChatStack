import axios from "axios";

const authApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Authorization header to all requests if token exists (skip for public endpoints)
authApi.interceptors.request.use(
    (config) => {
        // Skip adding Authorization header for public endpoints
        const publicEndpoints = ['/api/auth/register', '/api/auth/login', '/api/auth/verify', '/api/auth/resendOtp', '/api/auth/forgotPassword', '/api/auth/resetPassword'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
        
        if (!isPublicEndpoint) {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 errors by clearing token and redirecting to login
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default authApi;