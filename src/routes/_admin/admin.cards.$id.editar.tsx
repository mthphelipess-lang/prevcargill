import { createFileRoute, navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CardForm, notifySaveError } from "@/components/admin/CardForm";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { useCardForm } from "@/hooks/useCardForm";
import { useUpdateCard } from "@/hooks/useCards";
import { getAdminCard } from "@/services/cardService";
import { toCardDraft, type CardDraft } from "@/types/card";

export const Route = createFileRoute("/_admin/admin/cards/$id/editar")({
  head: () => ({ meta: [{ title: "Editar card — Área Restrita" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: EditCardPage,
});

function EditCardPage() {
  const { id } = Route.useParams();
  const update = useUpdateCard();
  const [initial, setInitial] = useState<CardDraft | null>(null);
  const [missing, setMissing] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setInitial(null);
    setMissing(false);
    setFailed(false);
    getAdminCard({ data: { id } })
      .then((row) => {
        if (!active) return;
        if (!row) {
          setMissing(true);
          return;
        }
        // A URL de exibição é temporária; o valor salvo é o original.
        setInitial({ ...toCardDraft(row), image_url: row.image_source_url });
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (missing) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground">Card não encontrado</h1>
        <p className="text-sm text-muted-foreground">Ele pode ter sido excluído.</p>
      </div>
    );
  }

  if (failed) {
    return <ErrorState message="Não foi possível carregar o card." />;
  }

  if (!initial) {
    return <LoadingState label="Carregando card..." />;
  }

  return <EditCardForm cardId={id} initial={initial} update={update} />;
}

function EditCardForm({ cardId, initial, update }: { cardId: string; initial: CardDraft; update: ReturnType<typeof useUpdateCard> }) {
  const { draft, setField, errors, submitted, handleSubmit } = useCardForm(initial);

  async function submit(values: CardDraft) {
    try {
      await update.mutateAsync({ id: cardId, draft: values });
      toast.success("Card atualizado.");
      navigate({ to: "/admin/cards" });
    } catch {
      notifySaveError();
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Editar card</h1>
      </header>
      <CardForm
        initial={draft}
        folderId={cardId}
        errors={errors}
        submitted={submitted}
        submitting={update.isPending}
        submitLabel="Salvar alterações"
        onChange={setField}
        onSubmit={() => handleSubmit(submit)}
        onCancel={() => navigate({ to: "/admin/cards" })}
      />
    </div>
  );
}
