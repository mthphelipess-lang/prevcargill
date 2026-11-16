import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { CardForm, notifySaveError } from "@/components/admin/CardForm";
import { useCardForm } from "@/hooks/useCardForm";
import { useCreateCard } from "@/hooks/useCards";
import { EMPTY_CARD_DRAFT, type CardDraft } from "@/types/card";

export const Route = createFileRoute("/_admin/admin/cards/novo")({
  head: () => ({ meta: [{ title: "Novo card — Área Restrita" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: NewCardPage,
});

function NewCardPage() {
  const navigate = useNavigate();
  const create = useCreateCard();
  const { draft, setField, errors, submitted, handleSubmit } = useCardForm(EMPTY_CARD_DRAFT);

  async function submit(values: CardDraft) {
    try {
      await create.mutateAsync(values);
      toast.success("Card criado.");
      navigate({ to: "/admin/cards" });
    } catch {
      notifySaveError();
    }
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Novo card</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os campos e salve. O card aparece na página inicial quando estiver publicado.
        </p>
      </header>

      <CardForm
        initial={draft}
        folderId="novo"
        errors={errors}
        submitted={submitted}
        submitting={create.isPending}
        submitLabel="Criar card"
        onChange={setField}
        onSubmit={() => handleSubmit(submit)}
        onCancel={() => navigate({ to: "/admin/cards" })}
      />
    </div>
  );
}
