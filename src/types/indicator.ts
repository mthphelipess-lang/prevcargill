import { z } from "zod";

export const harvestStatusSchema = z.enum([
  "in_progress",
  "planned",
  "paused",
  "completed",
  "unavailable",
]);

export const operationalIndicatorsSchema = z.object({
  trucksToday: z.number().int().nonnegative().nullable(),
  averageYardTimeMinutes: z.number().nonnegative().nullable(),
  activeBooths: z.number().int().nonnegative().nullable(),
  totalBooths: z.number().int().nonnegative().nullable(),
  harvestStatus: harvestStatusSchema,
  updatedAt: z.string().nullable(),
});

export type HarvestStatus = z.infer<typeof harvestStatusSchema>;
export type OperationalIndicatorsData = z.infer<typeof operationalIndicatorsSchema>;
export type IndicatorsState = "loading" | "success" | "empty" | "error";
