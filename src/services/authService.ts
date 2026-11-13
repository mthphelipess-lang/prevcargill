import { supabase } from "@/integrations/supabase/client";

/**
 * O login é por usuário, mas as credenciais do backend exigem um e-mail.
 * O e-mail sintético é derivado do usuário normalizado e nunca é exibido.
 */
const SYNTHETIC_DOMAIN = "app.local";

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
}

export function toAuthEmail(username: string): string {
  return `${normalizeUsername(username)}@${SYNTHETIC_DOMAIN}`;
}

export type SignInResult = { ok: true } | { ok: false; message: string };

export async function signInWithUsername(username: string, password: string): Promise<SignInResult> {
  const normalized = normalizeUsername(username);
  if (!normalized || !password) return { ok: false, message: "Informe o usuário e a senha." };

  const { error } = await supabase.auth.signInWithPassword({ email: toAuthEmail(normalized), password });
  if (error) return { ok: false, message: "Usuário ou senha inválidos." };
  return { ok: true };
}

export type AdminProfile = {
  id: string;
  username: string;
  displayName: string | null;
  isAdmin: boolean;
};

/** Lê o perfil e o papel do usuário da sessão, com RLS aplicada. */
export async function loadAdminProfile(): Promise<AdminProfile | null> {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const [profileResult, roleResult] = await Promise.all([
    supabase.from("profiles").select("id, username, display_name").eq("id", user.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(),
  ]);

  return {
    id: user.id,
    username: profileResult.data?.username ?? normalizeUsername(user.email ?? ""),
    displayName: profileResult.data?.display_name ?? null,
    isAdmin: Boolean(roleResult.data),
  };
}

/** Troca a senha do usuário autenticado e encerra as outras sessões. */
export async function changePassword(currentPassword: string, newPassword: string): Promise<SignInResult> {
  const { error } = await supabase.auth.updateUser({ password: newPassword, current_password: currentPassword });
  if (error) {
    return { ok: false, message: "Não foi possível alterar a senha. Verifique a senha atual e tente de novo." };
  }
  await supabase.auth.signOut({ scope: "others" });
  return { ok: true };
}

export async function signOutFromPortal(): Promise<void> {
  await supabase.auth.signOut();
}
