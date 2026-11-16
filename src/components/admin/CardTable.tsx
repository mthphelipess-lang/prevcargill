import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/iconMap";
import type { CardWithImage } from "@/services/cardService";

type Props = {
  cards: CardWithImage[];
  onEdit: (id: string) => void;
  onToggle: (card: CardWithImage) => void;
  onDelete: (card: CardWithImage) => void;
  busyId?: string | null | undefined;
};

export function CardTable({ cards, onEdit, onToggle, onDelete, busyId }: Props) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-card">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="hidden border-b border-border bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground md:table-header-group">
          <tr>
            <th className="px-3 py-2 font-semibold">Card</th>
            <th className="px-3 py-2 font-semibold">Destino</th>
            <th className="px-3 py-2 font-semibold">Fileira / ordem</th>
            <th className="px-3 py-2 font-semibold">Situação</th>
            <th className="px-3 py-2 text-right font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => {
            const Icon = getIcon(card.icon_name);
            const busy = busyId === card.id;
            return (
              <tr key={card.id} className="border-b border-border last:border-0 md:block md:contents">
                <td className="block px-3 py-2 md:table-cell">
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                    {card.name}
                  </span>
                </td>
                <td className="block px-3 py-2 text-muted-foreground md:table-cell">
                  <span className="block max-w-[280px] truncate">{card.destination_url}</span>
                  <span className="text-xs">{card.open_in_new_tab ? "abre em nova aba" : "abre na mesma aba"}</span>
                </td>
                <td className="block px-3 py-2 text-muted-foreground md:table-cell">
                  {card.row_group === "primary" ? "Principal" : "Complementar"} · {card.display_order}
                </td>
                <td className="block px-3 py-2 md:table-cell">
                  <Badge variant={card.enabled ? "default" : "secondary"}>
                    {card.enabled ? "Publicado" : "Indisponível"}
                  </Badge>
                </td>
                <td className="block px-3 py-2 md:table-cell md:text-right">
                  <span className="flex flex-wrap gap-1 md:justify-end">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="min-h-11 gap-1.5"
                      onClick={() => onEdit(card.id)}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Editar
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="min-h-11 gap-1.5"
                      disabled={busy}
                      onClick={() => onToggle(card)}
                    >
                      {card.enabled ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                      {card.enabled ? "Ocultar" : "Mostrar"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="min-h-11 gap-1.5 text-danger hover:bg-danger/10 hover:text-danger"
                      disabled={busy}
                      onClick={() => onDelete(card)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Excluir
                    </Button>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
