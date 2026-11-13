import { ModuleCard } from "@/components/modules/ModuleCard";
import { draftToVisual, type CardDraft } from "@/types/card";

/** Reprodução do card exatamente como ele aparece na página pública. */
export function CardPreview({ draft }: { draft: CardDraft }) {
  return (
    <section aria-label="Pré-visualização do card" className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Pré-visualização
      </h2>
      <div className="max-w-sm">
        <ModuleCard card={draftToVisual(draft)} interactive={false} />
      </div>
      <p className="text-xs text-muted-foreground">
        A imagem aparece menor aqui para caber na tela. Na página pública o card ocupa a largura
        inteira da coluna.
      </p>
    </section>
  );
}
