import { PortalLayout } from "@/layouts/PortalLayout";
import { PortalTitle } from "@/components/layout/PortalTitle";
import { ModuleGrid } from "@/components/modules/ModuleGrid";
import { OperationalIndicators } from "@/components/indicators/OperationalIndicators";
import { primaryModules, secondaryModules } from "@/config/modules";

export function HomePage() {
  return (
    <PortalLayout>
      <PortalTitle />
      <nav aria-label="Módulos do portal" className="flex flex-col gap-2.5 md:gap-3.5 xl:gap-4">
        <ModuleGrid modules={primaryModules} variant="primary" label="Módulos principais" />
        <ModuleGrid modules={secondaryModules} variant="secondary" label="Módulos complementares" />
      </nav>
      <OperationalIndicators />
    </PortalLayout>
  );
}
