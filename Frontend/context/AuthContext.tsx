'use client';
import { AuthContextType, User } from "@/lib/types";
import { authService } from "@/services/auth.service";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [pendingRegistration, setPendingRegistration] = useState<{
        email: string;
        username: string;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = authService.getToken();
                if (token) {
                    // Fetch real user data from backend
                    try {
                        const userData = await authService.getCurrentUser();
                        setUser({
                            id: userData.id,
                            username: userData.username,
                            email: userData.email || '' // /me endpoint doesn't return email, use empty string
                        });
                    } catch (err) {
                        console.error('Failed to fetch user data:', err);
                        // Token is invalid, clear it
                        authService.logout();
                    }
                }
            } catch (err) {
                console.error("Failed to initialize auth", err);
                authService.logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (
        username: string,
        password: string
    ) : Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.login({ username, password});

            // Backend returns flat structure: { token, id, username, email }
            setUser({
                id: response.id,
                username: response.username,
                email: response.email
            });
        } catch (err: any) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        credentials: {username: string; email: string; password: string;}
    ) : Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await authService.register({
                username: credentials.username,
                email: credentials.email,
                password: credentials.password
            });

            setPendingRegistration({
                email: response.email,
                username: response.username,
            });

        } catch (err: any) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (
        email: string, verificationCode: string
    ) : Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.verifyEmail(email, verificationCode);
            setPendingRegistration(null);
            return response.message;
        } catch (err: any) {
            const message = err instanceof Error ? err.message : 'Email verification failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setError(null);
        setPendingRegistration(null);
    };

    const getToken = (): string | null => {
        return authService.getToken();
    }

    const contextValue: AuthContextType = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        pendingRegistration,
        login,
        logout,
        getToken,
        register,
        verifyEmail
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}