"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const login = async (name: string, email: string) => {
    try {
      await api.post(
        "/auth/login",
        { name, email },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      router.push("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setIsAuthenticated(false);
        router.push("/");
      })
      .catch((error) => console.error("Logout failed", error));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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
};
