export interface User {
    id: number;
    username: string;
    email: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    id: number;
    username: string;
    email: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    enabled: boolean;
    verficationCode: string; // Received but never displayed
    verficationCodeExpiresAt: string; // ISO 8601 datetime
}

export interface VerifyEmailRequest {
    email: string;
    code: string; // Backend expects 'code' not 'verificationCode'
}

export interface VerifyEmailResponse {
    message: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    pendingRegistration: {email: string; username: string;} | null;

    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    getToken: () => string | null;
    register: (credentials: RegisterCredentials) => Promise<void>;
    verifyEmail: (email: string, verificationCode: string) => Promise<string>;
}