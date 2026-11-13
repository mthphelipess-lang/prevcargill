import { Link } from "@tanstack/react-router";
import { LockKeyhole, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const { profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-primary text-primary-foreground">
      <div className="mx-auto flex min-h-14 w-full max-w-[1400px] flex-wrap items-center justify-between gap-2 px-3 py-2 md:px-6">
        <div className="flex min-h-11 items-center gap-2">
          <LockKeyhole className="size-5 shrink-0" aria-hidden="true" />
          <div className="leading-tight">
            <p className="text-sm font-bold uppercase tracking-wide">Área Restrita</p>
            <p className="text-[11px] opacity-90">Logística Recebimento 4.0</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium underline-offset-4 hover:bg-primary-dark hover:underline"
          >
            Voltar ao portal
          </Link>
          <span className="hidden min-h-11 items-center px-2 text-sm font-medium sm:flex">
            {profile?.displayName ?? profile?.username ?? "Administrador"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void signOut()}
            className="min-h-11 gap-2 px-3 text-primary-foreground hover:bg-primary-dark hover:text-primary-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
