import { QueryClient } from "@tanstack/react-query";

/**
 * Instância única do cache: usada pelo router e pelo encerramento de sessão,
 * que precisa limpar os dados protegidos.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});
