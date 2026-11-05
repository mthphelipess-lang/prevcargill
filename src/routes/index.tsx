import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Logística Recebimento 4.0 — Portal" },
      { name: "description", content: "Portal corporativo de logística de recebimento: módulos operacionais e indicadores." },
      { property: "og:title", content: "Logística Recebimento 4.0 — Portal" },
      { property: "og:description", content: "Portal corporativo de logística de recebimento: módulos operacionais e indicadores." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});
