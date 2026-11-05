import { Link } from "@tanstack/react-router";
import { Truck } from "lucide-react";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="max-w-md rounded-card border border-border bg-background p-10 text-center shadow-card">
        <Truck className="mx-auto size-14 text-primary" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Página não encontrada</h1>
        <p className="mt-2 text-muted-foreground">O endereço acessado não existe no portal.</p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          Voltar para o portal
        </Link>
      </div>
    </main>
  );
}
