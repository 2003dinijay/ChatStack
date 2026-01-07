import authApi from "@/api/authApi";
import { LoginCredentials, LoginResponse, RegisterCredentials, RegisterResponse, VerifyEmailResponse } from "@/lib/types";
import axios from "axios";
import { get } from "http";
import { LogOut } from "lucide-react";

const saveToken = (token: string): void => {
    localStorage.setItem('authToken', token);
}

const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
}

const removeToken = (): void => {
    localStorage.removeItem('authToken');
}

const isTokenExpired = (token: string): boolean => {
    try {
        const parts = token.split('.');
        if(parts.length !== 3) return true;

        const payload = JSON.parse(atob(parts[1]));

        const expiryTime = payload.exp * 1000;

        return Date.now() >= expiryTime;
    } catch (error) {
        return true;
    }
};

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await authApi.post<LoginResponse>(
                '/api/auth/login',
                credentials
            );

            const {token, user} = response.data;
            if(!token || !user){
                throw new Error('Invalid login response');
            }
            saveToken(token);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data.message || 'Login failed');
            }
        }
        throw new Error('Login failed');
    },

    logout(): void {
        removeToken();
        authApi.post('/api/auth/logout').catch(() => {});
        window.location.href = '/login';
    },

    getToken(): string | null {
        const token = getToken();
        if (token && !isTokenExpired(token)) {
            return token;
        }
        return null;
    },

    isAuthenticated(): boolean {
        const token = getToken();
        if (!token) return false;
        return !isTokenExpired(token);
    },

    async register(credentials: {
        username: string;
        email: string;
        password: string;
    }) : Promise<RegisterResponse> {
        try {
            const response = await authApi.post<RegisterResponse>(
                "/api/auth/register",
                credentials
            );
            const { id, username, email} = response.data;
            if (!id || !username || !email) {
                throw new Error("Invalid register response");
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)){
                throw new Error(error.response?.data.message || 'Registration failed');
            }
            throw new Error('Registration failed');
        }
    },

    async verifyEmail(email: string, verificationCode: string): Promise<VerifyEmailResponse> {
        try {
            const response = await authApi.post<VerifyEmailResponse>(
                '/api/auth/verify',
                {
                    email,
                    verificationCode
                }
            );
            const { message } = response.data;
            if (!message) {
                throw new Error('Invalid verify email response');
            }
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)){
                throw new Error(error.response?.data.message || 'Email verification failed');
            }
            throw new Error('Email verification failed');
        }
    },
};