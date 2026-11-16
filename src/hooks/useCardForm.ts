import { useCallback, useState } from "react";
import { cardSchema } from "@/schemas/cardSchema";
import { isExternalDestination } from "@/lib/urlValidation";
import type { CardDraft } from "@/types/card";

export type CardFieldErrors = Partial<Record<keyof CardDraft, string>>;

/**
 * Estado do formulário de card: valida com as mesmas regras do banco e mostra
 * cada mensagem no campo correspondente.
 */
export function useCardForm(initial: CardDraft) {
  const [draft, setDraft] = useState<CardDraft>(initial);
  const [errors, setErrors] = useState<CardFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback((values: CardDraft) => {
    const parsed = cardSchema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return true;
    }
    const next: CardFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "") as keyof CardDraft;
      if (!next[key]) next[key] = issue.message;
    }
    setErrors(next);
    return false;
  }, []);

  const setField = useCallback(
    <K extends keyof CardDraft>(key: K, value: CardDraft[K]) => {
      setDraft((current) => {
        const next: CardDraft = { ...current, [key]: value };
        // Endereço externo abre em nova aba; endereço da própria aplicação não.
        if (key === "destination_url" && typeof value === "string") {
          next.open_in_new_tab = isExternalDestination(value);
        }
        if (submitted) validate(next);
        return next;
      });
    },
    [submitted, validate],
  );

  const handleSubmit = useCallback(
    (onValid: (values: CardDraft) => void) => {
      setSubmitted(true);
      if (validate(draft)) onValid(draft);
    },
    [draft, validate],
  );

  return { draft, setField, errors, submitted, validate, handleSubmit };
}
