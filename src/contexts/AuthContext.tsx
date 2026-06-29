import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, SignUpRequest, SignInRequest } from '../types';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  signIn: (data: SignInRequest) => Promise<boolean>;
  signUp: (data: SignUpRequest) => Promise<boolean>;
  signOut: () => void;
}

interface JwtPayload {
  userId: string;
  email: string;
  role: 'patient' | 'facility';
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('telemedic_token'));
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          // Token expired
          signOut();
          return;
        }

        const response = await api.auth.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          signOut();
        }
      } catch (error) {
        console.error('Failed to decode token or fetch profile', error);
        signOut();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const signIn = async (data: SignInRequest) => {
    const response = await api.auth.signIn(data);
    if (response.success && response.data) {
      localStorage.setItem('telemedic_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    }
    console.error('Sign-in failed:', response.error);
    return false;
  };

  const signUp = async (data: SignUpRequest) => {
    const response = await api.auth.signUp(data);
    if (response.success && response.data) {
      localStorage.setItem('telemedic_token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return true;
    }
    console.error('Sign-up failed:', response.error);
    return false;
  };

  const signOut = () => {
    localStorage.removeItem('telemedic_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut }}>
      {!loading && children}
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
