"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const getUserAuth = async () => {
      try {
        const res = await api.get("/auth/me",token);

        if (res?.success) {
          setUser(res.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("jwt");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        localStorage.removeItem("jwt");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getUserAuth();
  }, []);


  const handleLogin = async (email, password) => {
    try {
      setIsAuthenticating(true);

      const res = await api.post("/auth/login", { email, password });
      const { token, user, success } = res;

      if (success) {
        localStorage.setItem("jwt", token);
        setUser(user);
        setIsAuthenticated(true);
        router.replace("/dashboard");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignup = async (email, password) => {
    try {
      setIsAuthenticating(true);

      const res = await api.post("/auth/signup", { email, password });
      const { token, user, success } = res;

      if (success) {
        localStorage.setItem("jwt", token);
        setUser(user);
        setIsAuthenticated(true);
        router.replace("/dashboard");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setIsAuthenticated(false);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAuthenticating,
        handleLogin,
        handleSignup,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
