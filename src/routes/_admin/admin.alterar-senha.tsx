import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordSchema, type PasswordFormValues } from "@/schemas/passwordSchema";
import { changePassword } from "@/services/authService";
import { logAuthEvent } from "@/services/cardService";

export const Route = createFileRoute("/_admin/admin.alterar-senha")({
  head: () => ({ meta: [{ title: "Alterar senha — Área Restrita" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ChangePasswordPage,
});

const EMPTY: PasswordFormValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

function ChangePasswordPage() {
  const [values, setValues] = useState<PasswordFormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof PasswordFormValues, string>>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function setField(key: keyof PasswordFormValues, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = passwordSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof PasswordFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "") as keyof PasswordFormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setBusy(true);
    const result = await changePassword(values.currentPassword, values.newPassword);
    setBusy(false);

    if (!result.ok) {
      setErrors({ currentPassword: result.message });
      return;
    }

    try {
      await logAuthEvent({ data: { action: "password_changed" } });
    } catch {
      /* o registro não pode impedir a troca */
    }
    setValues(EMPTY);
    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-md space-y-3 rounded-md border border-border bg-card p-5">
        <p className="flex items-center gap-2 font-semibold text-primary">
          <CheckCircle2 className="size-5" aria-hidden="true" />
          Senha alterada com sucesso.
        </p>
        <p className="text-sm text-muted-foreground">
          As outras sessões abertas foram encerradas. Use a nova senha para entrar de novo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Alterar senha</h1>
        <p className="text-sm text-muted-foreground">
          A nova senha precisa ter no mínimo 10 caracteres, com letra maiúscula, minúscula, número e
          caractere especial.
        </p>
      </header>

      <form noValidate onSubmit={handleSubmit} className="space-y-3 rounded-md border border-border bg-card p-4">
        <div className="space-y-1.5">
          <Label htmlFor="pass-current">Senha atual</Label>
          <Input
            id="pass-current"
            type="password"
            autoComplete="current-password"
            value={values.currentPassword}
            aria-invalid={Boolean(errors.currentPassword)}
            onChange={(e) => setField("currentPassword", e.target.value)}
          />
          {errors.currentPassword && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.currentPassword}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pass-new">Nova senha</Label>
          <Input
            id="pass-new"
            type="password"
            autoComplete="new-password"
            value={values.newPassword}
            aria-invalid={Boolean(errors.newPassword)}
            onChange={(e) => setField("newPassword", e.target.value)}
          />
          {errors.newPassword && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.newPassword}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pass-confirm">Confirmar nova senha</Label>
          <Input
            id="pass-confirm"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            aria-invalid={Boolean(errors.confirmPassword)}
            onChange={(e) => setField("confirmPassword", e.target.value)}
          />
          {errors.confirmPassword && (
            <p role="alert" className="text-sm font-medium text-danger">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button type="submit" disabled={busy}>
          {busy ? "Salvando..." : "Alterar senha"}
        </Button>
      </form>
    </div>
  );
}
