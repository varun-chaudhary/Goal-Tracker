import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../constants.ts";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  goals: Goal[];
  fetchGoals: () => Promise<void>; // ADD THIS
}

export interface Goal {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  targetDate: Date;
  milestones: Milestone[];
}

export interface Milestone {
  id: number;
  title: string;
  status: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${BASE_URL}/goal/goal/${user.id}/`, {
        withCredentials: true,
      });
      setGoals(response.data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) fetchGoals();
  }, [user, fetchGoals]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user/login/`,
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/user/register/`,
        { name, email, password },
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setGoals([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout, isLoading, goals, fetchGoals }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
