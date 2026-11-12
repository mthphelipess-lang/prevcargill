import type { LucideIcon } from "lucide-react";

export type PortalModule = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  /** Vídeo exibido na área superior do card no lugar da imagem. */
  video?: string;
  icon: LucideIcon;
  url: string;
  openInNewTab: boolean;
  accentColor: "green" | "yellow";
  enabled: boolean;
  imageAlt: string;
  /** Visual alternativo para a área superior quando não há fotografia. */
  visual?: "ppr-graphic" | "links-graphic" | "joy-logo-placeholder";
};
