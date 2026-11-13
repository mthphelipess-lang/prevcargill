/**
 * Validação dos endereços de destino dos cards.
 * Bloqueia anything: URLs que executam código (javascript:, data:, vbscript:).
 */
const BLOCKED_SCHEMES = /^\s*(javascript|data|vbscript)\s*:/i;
const ALLOWED_DESTINATION = /^(https?:\/\/|\/|mailto:|tel:)/i;

export function isSafeDestination(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed === "#") return true;
  if (BLOCKED_SCHEMES.test(trimmed)) return false;
  return ALLOWED_DESTINATION.test(trimmed);
}

/** Endereço que sai do portal (http/https) — abre em nova aba. */
export function isExternalDestination(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value.trim());
}

export function destinationHint(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Informe o endereço de destino do card.";
  if (BLOCKED_SCHEMES.test(trimmed)) return "Esse tipo de endereço não é permitido.";
  if (!isSafeDestination(trimmed)) return "Use http://, https://, mailto:, tel:, / ou #.";
  return null;
}
