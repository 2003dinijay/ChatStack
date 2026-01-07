export interface User {
    id: string;
    username: string;
    email: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    id: string;
    username: string;
    email: string;
    enabled: boolean;
    message: string;
}

export interface VerifyEmailRequest {
    email: string;
    verificationCode: string;
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