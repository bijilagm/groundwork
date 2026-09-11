import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  authApi,
  type AuthResult,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "../lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const STORAGE_KEY = "groundwork.auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persist(result: AuthResult) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

function loadStored(): AuthResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResult) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthResult | null>(() => loadStored());

  useEffect(() => {
    if (session) {
      persist(session);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = useCallback(async (payload: LoginPayload) => {
    setSession(await authApi.login(payload));
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setSession(await authApi.register(payload));
  }, []);

  const logout = useCallback(() => setSession(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session
        ? {
            id: session.id,
            firstName: session.firstName,
            lastName: session.lastName,
            email: session.email,
          }
        : null,
      token: session?.token ?? null,
      login,
      register,
      logout,
    }),
    [session, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
