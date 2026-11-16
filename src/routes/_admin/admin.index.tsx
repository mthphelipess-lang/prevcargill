import { Link, createFileRoute } from "@tanstack/react-router";
import { EyeOff, FolderTree, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useAdminCards } from "@/hooks/useCards";

export const Route = createFileRoute("/_admin/admin/")({
  head: () => ({ meta: [{ title: "Painel — Área Restrita" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: cards, isPending, isError } = useAdminCards();
  const total = cards?.length ?? 0;
  const published = cards?.filter((c) => c.enabled).length ?? 0;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground">
          Publique, oculte e edite os cards que aparecem na página inicial do portal.
        </p>
      </header>

      {isPending && <LoadingState label="Carregando..." />}
      {isError && <ErrorState message="Não foi possível carregar os cards." />}

      {!isPending && !isError && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cards cadastrados</p>
            <p className="text-3xl font-bold text-foreground tabular-nums">{total}</p>
          </div>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Publicados</p>
            <p className="text-3xl font-bold text-primary tabular-nums">{published}</p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <EyeOff className="size-3" aria-hidden="true" /> {total - published} indisponíveis
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/admin/cards/novo">
            <PlusCircle className="size-4" aria-hidden="true" />
            Novo card
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/cards">
            <FolderTree className="size-4" aria-hidden="true" />
            Gerenciar cards
          </Link>
        </Button>
      </div>
    </div>
  );
}
