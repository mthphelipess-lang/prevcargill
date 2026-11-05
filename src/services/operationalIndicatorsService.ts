import { env } from "@/lib/env";
import { apiGet } from "./api";
import { operationalIndicatorsSchema, type OperationalIndicatorsData } from "@/types/indicator";

/**
 * MOCK — DADOS FICTÍCIOS SOMENTE PARA DEMONSTRAÇÃO LOCAL.
 * Usado apenas quando VITE_USE_MOCK_DATA não for "false".
 */
const MOCK_INDICATORS: OperationalIndicatorsData = {
  trucksToday: 362,
  averageYardTimeMinutes: 84,
  activeBooths: 8,
  totalBooths: 8,
  harvestStatus: "in_progress",
  updatedAt: new Date().toISOString(),
};

export async function fetchOperationalIndicators(): Promise<OperationalIndicatorsData> {
  if (env.useMockData) {
    await new Promise((r) => setTimeout(r, 600));
    return { ...MOCK_INDICATORS, updatedAt: new Date().toISOString() };
  }
  return apiGet("/api/operational-indicators", (d) => operationalIndicatorsSchema.parse(d));
}
