import { PortalLayout } from "@/layouts/PortalLayout";
import { PortalTitle } from "@/components/layout/PortalTitle";
import { ModuleGrid } from "@/components/modules/ModuleGrid";
import { OperationalIndicators } from "@/components/indicators/OperationalIndicators";
import { EmptyState } from "@/components/common/EmptyState";
import type { CardWithImage } from "@/services/cardService";

export function HomePage({ cards }: { cards: CardWithImage[] }) {
  const primary = cards.filter((c) => c.row_group === "primary");
  const secondary = cards.filter((c) => c.row_group === "secondary");

  return (
    <PortalLayout>
      <PortalTitle />
      <nav aria-label="Módulos do portal" className="flex flex-col gap-2.5 md:gap-3.5 xl:gap-4">
        {cards.length === 0 && <EmptyState message="Nenhum módulo disponível no momento." />}
        {primary.length > 0 && <ModuleGrid cards={primary} variant="primary" label="Módulos principais" />}
        {secondary.length > 0 && <ModuleGrid cards={secondary} variant="secondary" label="Módulos complementares" />}
      </nav>
      <OperationalIndicators />
    </PortalLayout>
  );
}
