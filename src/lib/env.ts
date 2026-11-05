/** Leitura centralizada das variáveis de ambiente (ver .env.example). */
const raw = import.meta.env;

export const env = {
  apiBaseUrl: (raw.VITE_API_BASE_URL as string | undefined) ?? "",
  /** Mock ativo por padrão. Defina VITE_USE_MOCK_DATA=false para consumir a API. */
  useMockData: (raw.VITE_USE_MOCK_DATA as string | undefined) !== "false",
  authMode: ((raw.VITE_AUTH_MODE as string | undefined) ?? "disabled") as "disabled" | "entra-id",
  isDev: import.meta.env.DEV,
};
