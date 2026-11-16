import { createFileRoute, navigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CardTable } from "@/components/admin/CardTable";
import { DeleteCardDialog } from "@/components/admin/DeleteCardDialog";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useAdminCards, useDeleteCard, useSetCardEnabled } from "@/hooks/useCards";
import type { CardWithImage } from "@/services/cardService";

export const Route = createFileRoute("/_admin/admin.cards")({
  head: () => ({ meta: [{ title: "Cards — Área Restrita" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminCardsPage,
});

function AdminCardsPage() {
  const { data: cards, isPending, isError } = useAdminCards();
  const toggle = useSetCardEnabled();
  const remove = useDeleteCard();
  const [pendingDelete, setPendingDelete] = useState<CardWithImage | null>(null);

  async function handleToggle(card: CardWithImage) {
    try {
      await toggle.mutateAsync({ id: card.id, enabled: !card.enabled });
      toast.success(card.enabled ? "Card ocultado." : "Card publicado.");
    } catch {
      toast.error("Não foi possível atualizar o card.");
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    try {
      await remove.mutateAsync(pendingDelete.id);
      toast.success("Card excluído.");
      setPendingDelete(null);
    } catch {
      toast.error("Não foi possível excluir o card.");
    }
  }

  const busyId = toggle.isPending ? toggle.variables?.id : remove.isPending ? remove.variables : null;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cards</h1>
          <p className="text-sm text-muted-foreground">
            Oculte, mostre, edite ou exclua os cards do portal.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">{cards?.length ?? 0} cadastrados</p>
      </header>

      {isPending && <LoadingState label="Carregando cards..." />}
      {isError && <ErrorState message="Não foi possível carregar os cards." />}

      {!isPending && !isError && (
        <CardTable
          cards={cards ?? []}
          busyId={busyId}
          onEdit={(id) => navigate({ to: "/admin/cards/$id/editar", params: { id } })}
          onToggle={(card) => void handleToggle(card)}
          onDelete={(card) => setPendingDelete(card)}
        />
      )}

      <DeleteCardDialog
        open={pendingDelete !== null}
        cardName={pendingDelete?.name ?? null}
        busy={remove.isPending}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
