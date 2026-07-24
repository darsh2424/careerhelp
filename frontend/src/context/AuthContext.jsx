import { createContext, useContext, useEffect, useState } from "react";
import { axiosClient } from "../api/axiosClient";

// Create a context for authentication
export const AuthContext = createContext(null)

// Create a provider component for authentication
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Determine if the user is authenticated based on the presence of user and token
    const isAuthenticated = !!user && !!token;
    console.log("AuthContext: isAuthenticated", isAuthenticated);
    
    function login(userData, tokenData) {
        setUser(userData);
        setToken(tokenData);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            tokenData
        );
    }
    const logout = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

    };
    const updateUser = (updatedUser) => {

        setUser(updatedUser);

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

    };
    // Load user and token from localStorage when the component mounts
    useEffect(() => {

        const initializaAuth = async () => {
            const storedToken = localStorage.getItem("token");
            if(!storedToken) {
                setLoading(false);
                return;
            }
            try{
                const response = await axiosClient.get("/auth/me")
                setToken(storedToken);
                setUser(response.data?.user || null);

                localStorage.setItem(
                "user",
                JSON.stringify(response.data?.user || {})
            );
            } catch (error) {
                logout();
            } finally {
                setLoading(false);
            }
        };

        initializaAuth();

    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout,updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the AuthContext
export function useAuth() {
    return useContext(AuthContext);
}