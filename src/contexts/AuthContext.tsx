import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import {
  loadAdminProfile,
  signInWithUsername,
  signOutFromPortal,
  type AdminProfile,
  type SignInResult,
} from "@/services/authService";
import { logAuthEvent } from "@/services/cardService";

/**
 * "Lembrar acesso" desmarcado: a sessão vale só para a aba atual.
 * O marcador vive em sessionStorage (morre com a aba), e o modo em localStorage.
 */
const SESSION_SCOPE_KEY = "portal-session-scope";
const TAB_SESSION_KEY = "portal-tab-session";

function readStorage(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function writeStorage(storage: Storage | undefined, key: string, value: string | null) {
  try {
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, value);
  } catch {
    /* armazenamento indisponível: segue com o padrão */
  }
}

/** Aba nova ou navegador reiniciado encerra a sessão que foi marcada como temporária. */
function applyTabSessionRule() {
  const scope = readStorage(window.localStorage, SESSION_SCOPE_KEY);
  const tabAlive = readStorage(window.sessionStorage, TAB_SESSION_KEY);
  if (scope === "tab" && !tabAlive) {
    writeStorage(window.localStorage, SESSION_SCOPE_KEY, null);
    void supabase.auth.signOut();
  }
  if (!tabAlive) writeStorage(window.sessionStorage, TAB_SESSION_KEY, "1");
}

export type AuthStatus = "loading" | "signedIn" | "signedOut";

export type AuthContextValue = {
  profile: AdminProfile | null;
  status: AuthStatus;
  signIn: (username: string, password: string, remember: boolean) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const refresh = useCallback(async () => {
    const next = await loadAdminProfile();
    setProfile(next);
    setStatus(next ? "signedIn" : "signedOut");
  }, []);

  useEffect(() => {
    applyTabSessionRule();
    void refresh();
  }, [refresh]);

  // Único ouvinte de sessão: mantém o estado e o cache do router coerentes.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      void refresh();
      router.invalidate();
      if (event !== "SIGNED_OUT") router.state.context.queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [refresh, router]);

  const signIn = useCallback(
    async (username: string, password: string, remember: boolean): Promise<SignInResult> => {
      const result = await signInWithUsername(username, password);
      if (!result.ok) return result;

      writeStorage(window.localStorage, SESSION_SCOPE_KEY, remember ? null : "tab");
      writeStorage(window.sessionStorage, TAB_SESSION_KEY, "1");
      await refresh();
      return result;
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    const queryClient = router.state.context.queryClient;
    try {
      await logAuthEvent({ data: { action: "logout" } });
    } catch {
      /* o registro não pode impedir sair */
    }
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOutFromPortal();
    writeStorage(window.localStorage, SESSION_SCOPE_KEY, null);
    setProfile(null);
    setStatus("signedOut");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ profile, status, signIn, signOut, refresh }),
    [profile, status, signIn, signOut, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
