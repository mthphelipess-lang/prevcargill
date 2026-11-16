import { PortalLayout } from "@/layouts/PortalLayout";
import { PortalTitle } from "@/components/layout/PortalTitle";
import { ModuleGrid } from "@/components/modules/ModuleGrid";
import { OperationalIndicators } from "@/components/indicators/OperationalIndicators";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { usePortalCards } from "@/hooks/useCards";

export function HomePage() {
  const { data, isPending, isError } = usePortalCards();
  const cards = data ?? [];
  const primary = cards.filter((c) => c.row_group === "primary");
  const secondary = cards.filter((c) => c.row_group === "secondary");

  return (
    <PortalLayout>
      <PortalTitle />
      <nav aria-label="Módulos do portal" className="flex flex-col gap-2.5 md:gap-3.5 xl:gap-4">
        {isPending && <LoadingState label="Carregando módulos..." />}
        {isError && <ErrorState message="Não foi possível carregar os módulos. Tente novamente." />}
        {!isPending && !isError && cards.length === 0 && (
          <EmptyState message="Nenhum módulo disponível no momento." />
        )}
        {!isPending && !isError && primary.length > 0 && (
          <ModuleGrid cards={primary} variant="primary" label="Módulos principais" />
        )}
        {!isPending && !isError && secondary.length > 0 && (
          <ModuleGrid cards={secondary} variant="secondary" label="Módulos complementares" />
        )}
      </nav>
      <OperationalIndicators />
    </PortalLayout>
  );
}
