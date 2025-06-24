import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from "sonner";
import API from "@/lib/axios";
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  // Add other fields as needed
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: string) => Promise<void>;
  signUp: (name: string, username: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  token: string | null;
  isAdmin: boolean;
}

interface Props {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // On mount, try to fetch user profile if token exists
    const fetchProfile = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await API.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (e: unknown) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const signIn = async (email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password, role });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      // Fetch user profile
      const profileRes = await API.get('/auth/profile', {
        headers: { Authorization: `Bearer ${res.data.token}` }
      });
      setUser(profileRes.data);
      toast.success('Successfully signed in!');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        // @ts-expect-error: error type from axios may not be inferred correctly
        toast.error(error.response.data?.msg || error.response.data?.error || 'Login failed');
      } else if (error instanceof Error) {
      toast.error(error.message || 'Login failed');
      } else {
        toast.error('Login failed');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (name: string, username: string, email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, username, email, password, role });
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
        // @ts-expect-error: error type from axios may not be inferred correctly
        toast.error(error.response.data?.msg || error.response.data?.error || 'Registration failed');
      } else if (error instanceof Error) {
      toast.error(error.message || 'Registration failed');
      } else {
        toast.error('Registration failed');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    toast.success('Successfully logged out!');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      logout, 
      token,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};