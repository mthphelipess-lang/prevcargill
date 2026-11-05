import { ExternalLink } from "lucide-react";

/** Indicação visual + leitor de tela para links que abrem em nova aba. */
export function ExternalLinkAlert() {
  return (
    <>
      <ExternalLink className="inline size-3.5" aria-hidden="true" />
      <span className="sr-only">(abre em nova aba)</span>
    </>
  );
}
