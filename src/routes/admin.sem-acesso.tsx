import { Link, createFileRoute } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/sem-acesso")({
  head: () => ({
    meta: [
      { title: "Acesso negado — Logística Recebimento 4.0" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccessDeniedPage,
});

function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-4 rounded-card border border-border bg-card p-6 text-center shadow-card">
        <ShieldX className="mx-auto size-10 text-danger" aria-hidden="true" />
        <h1 className="text-lg font-bold text-foreground">Acesso negado</h1>
        <p className="text-sm text-muted-foreground">
          A conta usada para entrar não tem permissão de administrador. Entre em contato com o suporte
          para solicitar acesso.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Voltar ao portal</Link>
        </Button>
      </div>
    </main>
  );
}
