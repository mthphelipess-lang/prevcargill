import { createContext, useContext, type ReactNode } from "react";
import type { PortalUser } from "@/types/user";
import { env } from "@/lib/env";

type AuthContextValue = { user: PortalUser; isAuthenticated: boolean; mode: typeof env.authMode };

/** Usuário temporário enquanto VITE_AUTH_MODE=disabled. */
const TEMP_USER: PortalUser = { name: "Matheus Phelipe", notificationCount: 3 };

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Preparado para Microsoft Entra ID (MSAL) no futuro.
 * Não há tenant/client IDs configurados nesta versão.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextValue = { user: TEMP_USER, isAuthenticated: true, mode: env.authMode };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
