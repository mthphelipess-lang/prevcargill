import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchOperationalIndicators } from "@/services/operationalIndicatorsService";
import type { IndicatorsState, OperationalIndicatorsData } from "@/types/indicator";
import { env } from "@/lib/env";

function isEmpty(d: OperationalIndicatorsData) {
  return (
    d.trucksToday === null &&
    d.averageYardTimeMinutes === null &&
    d.activeBooths === null &&
    d.harvestStatus === "unavailable"
  );
}

export function useOperationalIndicators() {
  const query = useQuery({
    queryKey: ["operational-indicators"],
    queryFn: fetchOperationalIndicators,
    refetchInterval: 5 * 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (query.error && env.isDev) console.error("[indicadores]", query.error);
  }, [query.error]);

  let state: IndicatorsState = "loading";
  if (query.isError) state = "error";
  else if (query.data) state = isEmpty(query.data) ? "empty" : "success";

  return { state, data: query.data ?? null };
}
