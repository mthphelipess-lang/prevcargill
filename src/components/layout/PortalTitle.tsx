import { Truck } from "lucide-react";
import { portalConfig } from "@/config/portal";

export function PortalTitle() {
  return (
    <div className="flex items-center gap-3 mt-2 py-5 md:gap-5 md:py-6 xl:py-7">
      <Truck className="size-9 shrink-0 text-primary md:size-[50px]" strokeWidth={1.8} aria-hidden="true" />
      <span className="h-10 w-0.5 shrink-0 bg-primary/70 md:h-12" aria-hidden="true" />
      <h1 className="relative text-[26px] font-bold leading-tight text-foreground md:text-[32px]">
        {portalConfig.name}
        <svg className="absolute -bottom-2 left-0 h-2 w-28 md:w-40" viewBox="0 0 160 8" preserveAspectRatio="none" aria-hidden="true">
          <path d="M2 6 C50 0 110 0 158 4" className="stroke-primary" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </h1>
    </div>
  );
}
