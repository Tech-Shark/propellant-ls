import React, {createContext, useContext, useState, useEffect} from 'react';
import {User, UserRole} from '@/types/user';
import axiosInstance from "@/api/AxiosInstance.ts";
import axios from "axios";
import {toast} from "sonner";
import {getCookie, setCookie} from "@/utils/CookieManagement";
import {useOTPContext} from "@/context/OTPContext.tsx";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<{ status: boolean, role: string }>;
    register: (
        phone: string,
        email: string,
        password: string,
        termsAndConditionsAccepted: boolean,
        role: UserRole,
        referralCode?: string
    ) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
    fetchUser: () => void;
    showOnboarding: boolean;
    setShowOnboarding: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const {setType, setIsVisible, setUrl} = useOTPContext();

    // Initialize the context with default values
    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    // Function to fetch user data from the API
    const fetchUser = async () => {
        console.log("fetching user...");
        axiosInstance.get("users", {
            headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`
            }}).then(response => {
                localStorage.setItem('user', JSON.stringify(response?.data.data));
                setUser(response.data.data);
            }).catch(error => {
                console.log(error);
            });
    }

    // Check if user is already logged in from localStorage or cookie
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            return;
        }
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            fetchUser();
        }
    }, []);

    // Function to handle user login
    const login = async (email: string, password: string) => {
        setIsLoading(true);

        let status = false;
        let role = 'TALENT';

        try {
            const loginPromise = axiosInstance.post('auth/login', {email, password});

            toast.promise(loginPromise, {
                    loading: 'Loading...',
                    success: (response) => {
                        console.log(response?.data);
                        setCookie("accessToken", response?.data.data.accessToken);
                        fetchUser();
                        status = true;
                        role = response?.data.data.role || 'TALENT';
                        return response?.data.message;
                    },
                    error: (error) => {
                        if (axios.isAxiosError(error)) {
                            if (error.response?.data?.appErrorCode == "EMAIL_NOT_VERIFIED") {
                                setUrl("/auth/verify-email");
                                setIsVisible(true);
                                setType("VERIFY_EMAIL");
                                return "Please verify your email";
                            }
                            console.log(error);
                            return error.response?.data.message && error.response?.data.message || error.message;
                        } else {
                            return "Something went wrong. Please try again later.";
                        }
                    },
                }
            );

            await loginPromise;
            return {status, role};
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle user registration
    const register = async (
        phone: string,
        email: string,
        password: string,
        termsAndConditionsAccepted: boolean,
        role: UserRole,
        referralCode?: string
    ) => {
        setIsLoading(true);

        let status = false;

        try {
            const registerPromise = axiosInstance.post('auth/register', {
                phone,
                email,
                password,
                termsAndConditionsAccepted,
                role,
                referralCode
            });

            toast.promise(registerPromise, {
                loading: 'Loading...',
                success: (response) => {
                    console.log(response?.data);
                    setUrl("/auth/verify-email");
                    setIsVisible(true);
                    setType("VERIFY_EMAIL");
                    status = true;
                    return response?.data.message;
                },
                error: (error) => {

                    if (axios.isAxiosError(error)) {
                        return error.response?.data.message;
                    } else {
                        return "Something went wrong. Please try again later.";
                    }
                },
            });

            await registerPromise;
            return status;
        } finally {
            setIsLoading(false);
        }
    }

    // Function to handle user logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setCookie('accessToken', '');
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{user, login, register, logout, isLoading, fetchUser, showOnboarding, setShowOnboarding}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
