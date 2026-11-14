import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthStatus, CompleteLearnerProfile } from '@/types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { getLearnerProfile } from '@/services/onboarding/onboardingService';
import { resetTestAccountData } from './resetAccountService';

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface AuthContextType {
  status: AuthStatus;
  user: User | null;
  isLoading: boolean;
  isSupabaseActive: boolean;
  signUp: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  login: (params: LoginParams) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  completeOnboardingSession: (profile: CompleteLearnerProfile) => Promise<void>;
  // Development reset option for active test account
  resetCurrentAccountToFreshState: () => Promise<void>;
  // Dev simulation helpers for testing and quick inspection
  loginAs: (type: 'complete' | 'incomplete') => void;
}

const STORAGE_SESSION_KEY = 'skillpath_auth_session';
const DEV_USERS_KEY = 'skillpath_dev_registered_users';

// Pre-seeded development accounts
const mockCompleteUser: User = {
  id: 'usr_dev_complete_101',
  email: 'alex.chen@nexora.ai',
  fullName: 'Alex Chen',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'student',
  targetCareerId: 'ai-specialist',
  isProfileComplete: true,
  createdAt: '2026-01-10T09:00:00Z',
  updatedAt: '2026-11-14T08:00:00Z',
};

const mockIncompleteUser: User = {
  id: 'usr_dev_incomplete_102',
  email: 'new.student@nexora.ai',
  fullName: 'Jordan Taylor',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  role: 'student',
  isProfileComplete: false,
  createdAt: '2026-11-14T08:00:00Z',
  updatedAt: '2026-11-14T08:00:00Z',
};

// Cryptographic hash helper to NEVER store plain-text passwords in development storage
async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + '_skillpath_salt_v4');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface StoredDevUser {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  isProfileComplete: boolean;
  createdAt: string;
}

function getStoredDevUsers(): StoredDevUser[] {
  try {
    const raw = localStorage.getItem(DEV_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredDevUsers(users: StoredDevUser[]) {
  localStorage.setItem(DEV_USERS_KEY, JSON.stringify(users));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('unauthenticated');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    async function initSession() {
      setIsLoading(true);

      // 1. If Supabase is configured, listen to Supabase auth session
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const su = data.session.user;
          const profile = await getLearnerProfile(su.id);
          const isComplete = Boolean(profile?.isOnboardingCompleted);

          const activeUser: User = {
            id: su.id,
            email: su.email || '',
            fullName: su.user_metadata?.full_name || 'Active Learner',
            avatarUrl: su.user_metadata?.avatar_url,
            role: 'student',
            isProfileComplete: isComplete,
            createdAt: su.created_at,
            updatedAt: new Date().toISOString(),
          };

          setUser(activeUser);
          setStatus(isComplete ? 'authenticated_complete' : 'authenticated_incomplete');
        } else {
          setUser(null);
          setStatus('unauthenticated');
        }

        // Setup real-time auth state listener
        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const profile = await getLearnerProfile(session.user.id);
            const isComplete = Boolean(profile?.isOnboardingCompleted);
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.full_name || 'Active Learner',
              avatarUrl: session.user.user_metadata?.avatar_url,
              role: 'student',
              isProfileComplete: isComplete,
              createdAt: session.user.created_at,
              updatedAt: new Date().toISOString(),
            });
            setStatus(isComplete ? 'authenticated_complete' : 'authenticated_incomplete');
          } else {
            setUser(null);
            setStatus('unauthenticated');
          }
        });

        setIsLoading(false);
        return () => listener.subscription.unsubscribe();
      }

      // 2. Development session restore
      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) {
        try {
          const parsedUser = JSON.parse(savedSession) as User;
          // Check if onboarding profile exists in isolated storage
          const profile = await getLearnerProfile(parsedUser.id);
          const isComplete = parsedUser.isProfileComplete || Boolean(profile?.isOnboardingCompleted);

          parsedUser.isProfileComplete = isComplete;
          setUser(parsedUser);
          setStatus(isComplete ? 'authenticated_complete' : 'authenticated_incomplete');
        } catch {
          localStorage.removeItem(STORAGE_SESSION_KEY);
          setUser(null);
          setStatus('unauthenticated');
        }
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }

      setIsLoading(false);
    }

    initSession();
  }, []);

  // Sync user changes to development session storage
  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (user) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    }
  }, [user]);

  // Sign up
  const signUp = async ({ email, password, fullName }: SignUpParams): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // 1. Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            fullName,
            role: 'student',
            isProfileComplete: false,
            createdAt: data.user.created_at,
            updatedAt: new Date().toISOString(),
          };
          setUser(newUser);
          setStatus('authenticated_incomplete');
          setIsLoading(false);
          return { success: true };
        }
      }

      // 2. Development Persistence Mode
      const devUsers = getStoredDevUsers();
      const existing = devUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existing) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email address already exists.' };
      }

      const passwordHash = await hashPassword(password);
      const newDevUser: StoredDevUser = {
        id: `usr_dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        email: email.trim().toLowerCase(),
        passwordHash,
        fullName: fullName.trim(),
        isProfileComplete: false,
        createdAt: new Date().toISOString(),
      };

      devUsers.push(newDevUser);
      saveStoredDevUsers(devUsers);

      const activeUser: User = {
        id: newDevUser.id,
        email: newDevUser.email,
        fullName: newDevUser.fullName,
        role: 'student',
        isProfileComplete: false,
        createdAt: newDevUser.createdAt,
        updatedAt: newDevUser.createdAt,
      };

      setUser(activeUser);
      setStatus('authenticated_incomplete');
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  // Login
  const login = async ({ email, password }: LoginParams): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // 1. Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile = await getLearnerProfile(data.user.id);
          const isComplete = Boolean(profile?.isOnboardingCompleted);

          const loggedInUser: User = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || 'Active Learner',
            avatarUrl: data.user.user_metadata?.avatar_url,
            role: 'student',
            isProfileComplete: isComplete,
            createdAt: data.user.created_at,
            updatedAt: new Date().toISOString(),
          };

          setUser(loggedInUser);
          setStatus(isComplete ? 'authenticated_complete' : 'authenticated_incomplete');
          setIsLoading(false);
          return { success: true };
        }
      }

      // 2. Development Mode (with cryptographic hash comparison)
      const cleanEmail = email.trim().toLowerCase();

      // Check pre-seeded demo accounts (supporting both @nexora.ai and legacy @skillpath.ai for backwards compatibility)
      if (cleanEmail === mockCompleteUser.email || cleanEmail === 'alex.chen@skillpath.ai') {
        setUser(mockCompleteUser);
        setStatus('authenticated_complete');
        setIsLoading(false);
        return { success: true };
      }

      if (cleanEmail === mockIncompleteUser.email || cleanEmail === 'new.student@skillpath.ai') {
        setUser(mockIncompleteUser);
        setStatus('authenticated_incomplete');
        setIsLoading(false);
        return { success: true };
      }

      // Check user-registered dev accounts
      const devUsers = getStoredDevUsers();
      const matched = devUsers.find((u) => u.email === cleanEmail);

      if (!matched) {
        setIsLoading(false);
        return { success: false, error: 'No account found with this email. Please check your spelling or sign up.' };
      }

      const inputHash = await hashPassword(password);
      if (inputHash !== matched.passwordHash) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      const profile = await getLearnerProfile(matched.id);
      const isComplete = matched.isProfileComplete || Boolean(profile?.isOnboardingCompleted);

      const activeUser: User = {
        id: matched.id,
        email: matched.email,
        fullName: matched.fullName,
        role: 'student',
        isProfileComplete: isComplete,
        createdAt: matched.createdAt,
        updatedAt: new Date().toISOString(),
      };

      setUser(activeUser);
      setStatus(isComplete ? 'authenticated_complete' : 'authenticated_incomplete');
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setUser(null);
    setStatus('unauthenticated');
    setIsLoading(false);
  };

  // Complete Onboarding Session
  const completeOnboardingSession = async (profile: CompleteLearnerProfile) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      targetCareerId: profile.careerGoal,
      isProfileComplete: true,
      updatedAt: new Date().toISOString(),
    };

    // Update in dev storage if applicable
    if (!isSupabaseConfigured) {
      const devUsers = getStoredDevUsers();
      const idx = devUsers.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        devUsers[idx].isProfileComplete = true;
        saveStoredDevUsers(devUsers);
      }
    }

    setUser(updatedUser);
    setStatus('authenticated_complete');
  };

  // Reset Current Test Account to Fresh State (First-Time User Test)
  const resetCurrentAccountToFreshState = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      await resetTestAccountData(user);

      const freshUser: User = {
        ...user,
        isProfileComplete: false,
        targetCareerId: undefined,
        updatedAt: new Date().toISOString(),
      };

      if (!isSupabaseConfigured) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(freshUser));
      }

      setUser(freshUser);
      setStatus('authenticated_incomplete');
    } finally {
      setIsLoading(false);
    }
  };

  // Direct dev switchers
  const loginAs = (type: 'complete' | 'incomplete') => {
    if (type === 'complete') {
      setUser(mockCompleteUser);
      setStatus('authenticated_complete');
    } else {
      setUser(mockIncompleteUser);
      setStatus('authenticated_incomplete');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        user,
        isLoading,
        isSupabaseActive: isSupabaseConfigured,
        signUp,
        login,
        logout,
        completeOnboardingSession,
        resetCurrentAccountToFreshState,
        loginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
