'use client';
import { AuthContextType, User } from "@/lib/types";
import { authService } from "@/services/auth.service";
import { createContext, useContext, useEffect, useState } from "react";

// create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // onfirst load , check for token in localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            const token = authService.getToken();
            const storedUser = localStorage.getItem('user');
            if (token && storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                }
                catch (error) {
                    console.error("Failed to parse stored user:", error);
                    authService.logout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const login = async (username: string, password: string): Promise<void> => {
        try {
            const data = await authService.login({ username, password });
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        localStorage.removeItem('user');
    };

    const contextValue: AuthContextType = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}