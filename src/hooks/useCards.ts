import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCard,
  deleteCard,
  listAdminCards,
  listPortalCards,
  setCardEnabled,
  updateCard,
} from "@/services/cardService";
import type { CardDraft } from "@/types/card";

export const portalCardsQueryOptions = queryOptions({
  queryKey: ["portal-cards"],
  queryFn: () => listPortalCards(),
  staleTime: 30_000,
});

export const adminCardsQueryOptions = queryOptions({
  queryKey: ["admin-cards"],
  queryFn: () => listAdminCards(),
  staleTime: 15_000,
});

export function usePortalCards() {
  return useQuery(portalCardsQueryOptions);
}

export function useAdminCards() {
  return useQuery(adminCardsQueryOptions);
}

/** Depois de qualquer alteração, a lista administrativa e a página pública são atualizadas. */
function useInvalidateCards() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["admin-cards"] });
    queryClient.invalidateQueries({ queryKey: ["portal-cards"] });
  };
}

export function useCreateCard() {
  const invalidate = useInvalidateCards();
  return useMutation({ mutationFn: (draft: CardDraft) => createCard({ data: draft }), onSuccess: invalidate });
}

export function useUpdateCard() {
  const invalidate = useInvalidateCards();
  return useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: CardDraft }) => updateCard({ data: { ...draft, id } }),
    onSuccess: invalidate,
  });
}

export function useSetCardEnabled() {
  const invalidate = useInvalidateCards();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => setCardEnabled({ data: { id, enabled } }),
    onSuccess: invalidate,
  });
}

export function useDeleteCard() {
  const invalidate = useInvalidateCards();
  return useMutation({ mutationFn: (id: string) => deleteCard({ data: { id } }), onSuccess: invalidate });
}
