import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "ROLE_HOD" | "ROLE_STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User & { password: string }> = {
  "hod@college.edu": {
    id: "hod-1",
    name: "Dr. Rajesh Kumar",
    email: "hod@college.edu",
    role: "ROLE_HOD",
    department: "Computer Science",
    password: "admin123",
  },
  "staff@college.edu": {
    id: "staff-1",
    name: "Prof. Anita Sharma",
    email: "staff@college.edu",
    role: "ROLE_STAFF",
    department: "Computer Science",
    password: "staff123",
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("portal_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, password: string, role: UserRole): boolean => {
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.password === password && mockUser.role === role) {
      const { password: _, ...userData } = mockUser;
      setUser(userData);
      sessionStorage.setItem("portal_user", JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("portal_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
