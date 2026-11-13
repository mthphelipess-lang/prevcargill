import type { MouseEvent } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/iconMap";
import type { CardVisual } from "@/types/card";

/**
 * Reprodução do card da página pública. Não contém endereços: o destino vem
 * sempre do card recebido.
 */
function CardVisual({ card }: { card: CardVisual }) {
  const Icon = getIcon(card.icon_name);

  if (card.video_url) {
    return (
      <video
        src={card.video_url}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-label={card.image_alt ?? `Vídeo do card ${card.name}`}
        className="h-full w-full object-cover"
      />
    );
  }

  if (card.image_url) {
    if (card.image_fit === "contain") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-background p-6">
          <img
            src={card.image_url}
            alt={card.image_alt ?? ""}
            loading="lazy"
            className="max-h-full w-auto max-w-full object-contain"
          />
        </div>
      );
    }
    return (
      <img
        src={card.image_url}
        alt={card.image_alt ?? ""}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    );
  }

  if (card.placeholder_style === "icon-green") {
    return (
      <div
        role="img"
        aria-label={card.image_alt ?? `Ícone ${card.icon_name}`}
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark"
      >
        <Icon className="size-16 text-primary-foreground/90" strokeWidth={1.5} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={card.image_alt ?? `Ícone ${card.icon_name}`}
      className="flex h-full w-full items-center justify-center bg-muted"
    >
      <span className="flex size-20 items-center justify-center rounded-full bg-background shadow-card">
        <Icon className="size-10 text-primary" aria-hidden="true" />
      </span>
    </div>
  );
}

type Props = { card: CardVisual; interactive?: boolean };

export function ModuleCard({ card, interactive = true }: Props) {
  const Icon = getIcon(card.icon_name);
  const notConfigured = card.destination_url === "#" || !card.destination_url;
  const disabled = !card.enabled;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (notConfigured) {
      e.preventDefault();
      toast.info("Endereço do módulo ainda não configurado.");
    }
  };

  const label = [
    card.name,
    card.description,
    disabled ? "Indisponível" : null,
    card.open_in_new_tab && !disabled ? "(abre em nova aba)" : null,
  ]
    .filter(Boolean)
    .join(" — ");

  const shell = cn(
    "group flex h-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-card transition-all duration-200",
    disabled
      ? "cursor-not-allowed opacity-60 grayscale"
      : "cursor-pointer hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover",
  );

  const body = (
    <>
      <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
        <CardVisual card={card} />
      </div>
      <div className="flex flex-1 items-center gap-3 px-4 py-3">
        <Icon className="size-7 shrink-0 text-primary" aria-hidden="true" />
        <span className="flex flex-col">
          <span className="text-xl font-bold leading-tight text-foreground xl:text-[22px]">{card.name}</span>
          {disabled && <span className="text-sm font-medium text-muted-foreground">Indisponível</span>}
        </span>
      </div>
      <span
        className={cn("h-[5px] w-full", card.accent_color === "green" ? "bg-primary" : "bg-accent")}
        aria-hidden="true"
      />
    </>
  );

  if (!interactive) {
    return <div className={cn(shell, "cursor-default")}>{body}</div>;
  }

  return (
    <a
      href={disabled ? undefined : card.destination_url}
      target={card.open_in_new_tab && !notConfigured ? "_blank" : undefined}
      rel={card.open_in_new_tab ? "noopener noreferrer" : undefined}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === " ") {
          e.preventDefault();
          e.currentTarget.click();
        }
      }}
      aria-label={label}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      title={card.description ?? undefined}
      className={shell}
    >
      {body}
    </a>
  );
}
