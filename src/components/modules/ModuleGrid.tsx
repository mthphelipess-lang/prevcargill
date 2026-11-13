import { cn } from "@/lib/utils";
import type { CardRow } from "@/types/card";
import { ModuleCard } from "./ModuleCard";

type Props = { cards: CardRow[]; variant: "primary" | "secondary"; label: string };

export function ModuleGrid({ cards, variant, label }: Props) {
  return (
    <ul
      aria-label={label}
      className={cn(
        "grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 md:gap-3.5 xl:gap-4",
        variant === "primary"
          ? "module-grid-primary md:grid-cols-2 lg:grid-cols-4"
          : "module-grid-secondary md:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {cards.map((card) => (
        <li key={card.id}>
          <ModuleCard card={card} />
        </li>
      ))}
    </ul>
  );
}
