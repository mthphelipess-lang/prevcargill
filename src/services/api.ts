import { env } from "@/lib/env";

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

/** Cliente HTTP base. Futuro: anexar token do Microsoft Entra ID aqui. */
export async function apiGet<T>(path: string, parse: (data: unknown) => T): Promise<T> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(`Falha ao consultar ${path}`, res.status);
  return parse(await res.json());
}
