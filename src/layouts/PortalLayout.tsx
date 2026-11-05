import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { navigation } from "@/config/navigation";

export function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background">
      <a
        href={`#${navigation.skipTargetId}`}
        className="sr-only z-50 rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id={navigation.skipTargetId} tabIndex={-1} className="portal-container flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
