import React, { createContext, useContext, useState, useEffect } from "react";
import { ADMIN_CREDENTIALS } from "../data/config";

const AUTH_KEY = "sharaaya_admin_session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const s = sessionStorage.getItem(AUTH_KEY);
      return s ? JSON.parse(s) : null;
    } catch (_) {
      return null;
    }
  });

  const login = (username, password) => {
    const found = ADMIN_CREDENTIALS.find(
      (c) => c.username === username && c.password === password
    );
    if (found) {
      const session = { username: found.username, name: found.name };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
      setAdmin(session);
      return { success: true };
    }
    return { success: false, error: "Invalid username or password. Please try again." };
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoggedIn: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
