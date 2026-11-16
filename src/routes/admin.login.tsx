import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { portalConfig } from "@/config/portal";
import { useAuth } from "@/hooks/useAuth";
import { logAuthEvent } from "@/services/cardService";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/admin/login")({
  // Só no navegador: evita que o botão seja clicado antes da tela ficar interativa.
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Entrar na Área Restrita — Logística Recebimento 4.0" },
      { name: "description", content: "Entrada da área administrativa do portal Logística Recebimento 4.0." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { signIn, status } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "signedIn") void navigate({ to: "/admin", replace: true });
  }, [status, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Informe o usuário e a senha.");
      return;
    }

    setBusy(true);
    let result: Awaited<ReturnType<typeof signIn>>;
    try {
      result = await signIn(username, password, remember);
    } catch (err) {
      console.error("[login] falha ao entrar", err);
      result = { ok: false, message: "Não foi possível entrar. Tente novamente." };
    }
    setBusy(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    try {
      await logAuthEvent({ data: { action: "login_success" } });
    } catch {
      /* o registro não pode impedir a entrada */
    }
    void navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-5 rounded-card border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col items-center gap-2 text-center">
          <img src={portalConfig.logoUrl ?? undefined} alt={portalConfig.logoAlt} className="h-9 w-auto" />
          <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Área Restrita
          </span>
          <h1 className="text-lg font-bold text-foreground">Entrar com usuário e senha</h1>
        </div>

        <form noValidate onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="login-user">Usuário</Label>
            <Input
              id="login-user"
              value={username}
              autoComplete="username"
              aria-invalid={Boolean(error)}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="login-pass">Senha</Label>
            <Input
              id="login-pass"
              type="password"
              value={password}
              autoComplete="current-password"
              aria-invalid={Boolean(error)}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex min-h-11 items-center gap-2">
            <Checkbox
              id="login-remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
            />
            <Label htmlFor="login-remember" className="cursor-pointer text-sm font-normal">
              Lembrar acesso
            </Label>
          </div>

          {error && (
            <p role="alert" className="rounded-md border border-danger/40 bg-danger/5 p-2 text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <Link to="/" className="block text-center text-sm text-muted-foreground underline-offset-4 hover:underline">
          Voltar ao portal
        </Link>
      </div>
    </main>
  );
}
