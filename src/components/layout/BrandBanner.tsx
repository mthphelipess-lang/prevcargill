import { portalConfig } from "@/config/portal";

/** Logotipo (área branca) + faixa curva verde/amarela + fotografia industrial. */
export function BrandBanner() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-background" aria-hidden={false}>
      <img
        src={portalConfig.bannerImage}
        alt={portalConfig.bannerAlt}
        width={1920}
        height={640}
        className="absolute inset-y-0 right-0 h-full w-[78%] object-cover object-center md:w-[72%]"
      />
      {/* Faixa institucional curva */}
      <svg
        className="absolute inset-y-0 left-0 h-full w-[46%] md:w-[38%]"
        viewBox="0 0 400 160"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0 H300 C250 50 270 110 230 160 H0 Z" className="fill-background" />
        <path d="M300 0 H322 C272 50 292 110 252 160 H230 C270 110 250 50 300 0 Z" className="fill-accent" />
        <path d="M322 0 H352 C302 50 322 110 282 160 H252 C292 110 272 50 322 0 Z" className="fill-primary" />
      </svg>
      <div className="absolute inset-y-0 left-0 flex w-[34%] items-center pl-3 md:w-[26%] md:pl-6">
        {portalConfig.logoUrl ? (
          <img src={portalConfig.logoUrl} alt={portalConfig.logoAlt} className="max-h-16 max-w-full object-contain" />
        ) : (
          // PLACEHOLDER: substituir pelo logotipo oficial em src/config/portal.ts (logoUrl)
          <div
            role="img"
            aria-label="Espaço reservado para o logotipo da empresa"
            className="flex h-12 w-28 items-center justify-center rounded-md border-2 border-dashed border-border text-sm font-semibold tracking-widest text-muted-foreground md:h-16 md:w-40"
          >
            LOGO
          </div>
        )}
      </div>
    </div>
  );
}
