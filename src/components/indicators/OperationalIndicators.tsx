import { Timer, Truck } from "lucide-react";
import { format } from "date-fns";
import { OperationalIndicator } from "./OperationalIndicator";
import { useOperationalIndicators } from "@/hooks/useOperationalIndicators";

export function formatYardTime(minutes: number | null) {
  if (minutes === null) return null;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}min`;
}

export function OperationalIndicators() {
  const { state, data } = useOperationalIndicators();
  const loading = state === "loading";
  const d = state === "success" ? data : null;

  return (
    <section aria-label="Indicadores operacionais" className="mt-3 overflow-hidden rounded-xl border border-border bg-background shadow-card">
      <div className="grid grid-cols-1 divide-y divide-border min-[480px]:grid-cols-2 min-[480px]:divide-x min-[480px]:divide-y-0">
        <OperationalIndicator icon={Truck} label="Caminhões hoje" loading={loading} value={d?.trucksToday != null ? String(d.trucksToday) : null} />
        <OperationalIndicator icon={Timer} label="Tempo médio no pátio" loading={loading} value={d ? formatYardTime(d.averageYardTimeMinutes) : null} />
      </div>
      <div aria-live="polite" className="border-t border-border bg-muted px-4 py-1.5 text-right text-[13px] font-medium text-muted-foreground empty:hidden">
        {state === "error" && "Não foi possível carregar os indicadores no momento."}
        {state === "empty" && "Indicadores ainda não disponíveis."}
        {d?.updatedAt && `Atualizado às ${format(new Date(d.updatedAt), "HH:mm")}`}
      </div>
    </section>
  );
}
