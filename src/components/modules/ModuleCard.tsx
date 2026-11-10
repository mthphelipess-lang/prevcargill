import type { MouseEvent } from "react";
import { ChartNoAxesCombined, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { PortalModule } from "@/types/module";

function ModuleVisual({ module }: { module: PortalModule }) {
  if (module.image) {
    if (module.id === "joy") {
      return (
        <div className="flex h-full w-full items-center justify-center bg-background p-6">
          <img src={module.image} alt={module.imageAlt} loading="lazy" width={1212} height={414} className="max-h-full w-auto max-w-full object-contain" />
        </div>
      );
    }
    return <img src={module.image} alt={module.imageAlt} loading="lazy" width={992} height={672} className="h-full w-full object-cover" />;
  }
  if (module.visual === "ppr-graphic") {
    return (
      <div role="img" aria-label={module.imageAlt} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
        <ChartNoAxesCombined className="size-16 text-primary-foreground/90" strokeWidth={1.5} aria-hidden="true" />
      </div>
    );
  }
  if (module.visual === "links-graphic") {
    return (
      <div role="img" aria-label={module.imageAlt} className="flex h-full w-full items-center justify-center bg-muted">
        <span className="flex size-20 items-center justify-center rounded-full bg-background shadow-card">
          <LinkIcon className="size-10 text-primary" aria-hidden="true" />
        </span>
      </div>
    );
  }
  // JOY — placeholder do logotipo oficial
  return (
    <div role="img" aria-label={module.imageAlt} className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-dashed border-border px-6 py-3">
        <span className="text-3xl font-bold tracking-wider">
          <span className="text-joy-j">J</span>
          <span className="text-joy-o">O</span>
          <span className="text-joy-y">Y</span>
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Logotipo oficial</span>
      </div>
    </div>
  );
}

export function ModuleCard({ module }: { module: PortalModule }) {
  const Icon = module.icon;
  const notConfigured = module.url === "#" || !module.url;
  const disabled = !module.enabled;

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

  const label = [module.name, module.description, disabled ? "Indisponível" : null, module.openInNewTab && !disabled ? "(abre em nova aba)" : null]
    .filter(Boolean)
    .join(" — ");

  return (
    <a
      href={disabled ? undefined : module.url}
      target={module.openInNewTab && !notConfigured ? "_blank" : undefined}
      rel={module.openInNewTab ? "noopener noreferrer" : undefined}
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
      title={module.description}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-card transition-all duration-200",
        disabled
          ? "cursor-not-allowed opacity-60 grayscale"
          : "cursor-pointer hover:-translate-y-0.5 hover:border-primary hover:shadow-card-hover",
      )}
    >
      <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
        <ModuleVisual module={module} />
      </div>
      <div className="flex flex-1 items-center gap-3 px-4 py-3">
        <Icon className="size-7 shrink-0 text-primary" aria-hidden="true" />
        <span className="flex flex-col">
          <span className="text-xl font-bold leading-tight text-foreground xl:text-[22px]">{module.name}</span>
          {disabled && <span className="text-sm font-medium text-muted-foreground">Indisponível</span>}
        </span>
      </div>
      <span className={cn("h-[5px] w-full", module.accentColor === "green" ? "bg-primary" : "bg-accent")} aria-hidden="true" />
    </a>
  );
}
