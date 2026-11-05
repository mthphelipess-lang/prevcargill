import { DoorOpen, Leaf, Timer, Truck } from "lucide-react";
import { format } from "date-fns";
import { OperationalIndicator } from "./OperationalIndicator";
import { useOperationalIndicators } from "@/hooks/useOperationalIndicators";
import type { HarvestStatus, OperationalIndicatorsData } from "@/types/indicator";

const HARVEST_LABELS: Record<HarvestStatus, string> = {
  in_progress: "Em andamento",
  planned: "Planejada",
  paused: "Pausada",
  completed: "Finalizada",
  unavailable: "Indisponível",
};

export function formatYardTime(minutes: number | null) {
  if (minutes === null) return null;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}min`;
}

function formatBooths(d: OperationalIndicatorsData) {
  if (d.activeBooths === null || d.totalBooths === null) return null;
  return `${d.activeBooths} de ${d.totalBooths}`;
}

export function OperationalIndicators() {
  const { state, data } = useOperationalIndicators();
  const loading = state === "loading";
  const d = state === "success" ? data : null;

  return (
    <section aria-label="Indicadores operacionais" className="mt-6 overflow-hidden rounded-card border border-border bg-background shadow-card">
      <div className="grid grid-cols-1 divide-y divide-border min-[480px]:grid-cols-2 md:grid-cols-3 md:divide-y-0 xl:grid-cols-5 xl:divide-x">
        <OperationalIndicator icon={Truck} label="Operação de Recebimento" isHeading />
        <OperationalIndicator icon={Truck} label="Caminhões hoje" loading={loading} value={d?.trucksToday != null ? String(d.trucksToday) : null} />
        <OperationalIndicator icon={Timer} label="Tempo médio no pátio" loading={loading} value={d ? formatYardTime(d.averageYardTimeMinutes) : null} />
        <OperationalIndicator icon={DoorOpen} label="Guichês em operação" loading={loading} value={d ? formatBooths(d) : null} />
        <OperationalIndicator icon={Leaf} label="Status da Safra" loading={loading} value={d ? HARVEST_LABELS[d.harvestStatus] : null} />
      </div>
      <div aria-live="polite" className="border-t border-border bg-muted px-4 py-1.5 text-right text-[13px] font-medium text-muted-foreground empty:hidden">
        {state === "error" && "Não foi possível carregar os indicadores no momento."}
        {state === "empty" && "Indicadores ainda não disponíveis."}
        {d?.updatedAt && `Atualizado às ${format(new Date(d.updatedAt), "HH:mm")}`}
      </div>
    </section>
  );
}
