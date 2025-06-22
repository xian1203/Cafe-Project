import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from "sonner";

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // On mount, try to fetch user profile if token exists
    const fetchProfile = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
          }
        } catch (e) {
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [token]);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Login failed');
      }
      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      // Fetch user profile
      const profileRes = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${data.token}` }
      });
      const profile = await profileRes.json();
      setUser(profile);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Registration failed');
      }
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
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
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, token }}>
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