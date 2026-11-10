import { Mail, Phone } from "lucide-react";
import { portalConfig } from "@/config/portal";

export function Footer() {
  const tel = portalConfig.supportPhone.replace(/\D/g, "");
  return (
    <footer className="mt-8 bg-primary-dark text-primary-foreground">
      <div className="portal-container flex flex-col gap-4 py-5 text-[15px] md:min-h-[76px] md:flex-row md:items-center md:justify-between md:py-3">
        <div className="flex items-center gap-4">
          {portalConfig.logoUrl ? (
            <span className="flex items-center rounded-md bg-background px-3 py-1.5">
              <img src={portalConfig.logoUrl} alt={portalConfig.logoAlt} className="h-8 w-auto" />
            </span>
          ) : (
            <span className="rounded border border-dashed border-primary-foreground/60 px-3 py-1.5 text-xs font-semibold tracking-widest" role="img" aria-label="Espaço reservado para o logotipo">
              LOGO
            </span>
          )}
          <span className="h-8 w-px bg-primary-foreground/40" aria-hidden="true" />
          <span className="font-semibold">{portalConfig.name}</span>
        </div>
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
          <a href={`mailto:${portalConfig.supportEmail}`} className="flex min-h-11 items-center gap-2 rounded hover:underline">
            <Mail className="size-5 text-accent" aria-hidden="true" />
            <span>
              {portalConfig.supportLabel}: {portalConfig.supportEmail}
            </span>
          </a>
          <span className="hidden h-6 w-px bg-primary-foreground/40 md:block" aria-hidden="true" />
          <a href={`tel:${tel}`} className="flex min-h-11 items-center gap-2 rounded hover:underline">
            <Phone className="size-5 text-accent" aria-hidden="true" />
            <span>{portalConfig.supportPhone}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
