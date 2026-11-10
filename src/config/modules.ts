import {
  BadgeCheck,
  Timer,
  DoorOpen,
  Leaf,
  ChartNoAxesCombined,
  FileText,
  Link,
  Users,
  Headset,
} from "lucide-react";
import type { PortalModule } from "@/types/module";
import csdImg from "@/assets/images/module-csd.jpg";
import trpImg from "@/assets/images/module-trp.jpg";
import guichesImg from "@/assets/images/module-guiches.jpg";
import safraImg from "@/assets/images/module-safra.jpg";
import faturamentoImg from "@/assets/images/module-faturamento.jpg";
import abigailImg from "@/assets/images/module-abigail.jpg";
import joyLogo from "@/assets/logo-joy.png.asset.json";

/**
 * Configuração dos módulos do portal.
 * Altere nomes, imagens, URLs e estado aqui — os componentes não precisam mudar.
 * url "#" = endereço ainda não configurado (exibe aviso, não navega).
 */
export const primaryModules: PortalModule[] = [
  { id: "csd", name: "CSD", image: csdImg, imageAlt: "Motorista de caminhão ao volante", icon: BadgeCheck, url: "#", openInNewTab: false, accentColor: "green", enabled: true },
  { id: "trp", name: "TRP", description: "Tempo de Pátio", image: trpImg, imageAlt: "Caminhões aguardando no pátio de entrada", icon: Timer, url: "#", openInNewTab: false, accentColor: "yellow", enabled: true },
  { id: "gestao-guiches", name: "Gestão Guichês", image: guichesImg, imageAlt: "Guarita de entrada com cancela", icon: DoorOpen, url: "#", openInNewTab: false, accentColor: "green", enabled: true },
  { id: "safra", name: "Safra", image: safraImg, imageAlt: "Tomates vermelhos ainda na planta", icon: Leaf, url: "#", openInNewTab: false, accentColor: "yellow", enabled: true },
];

export const secondaryModules: PortalModule[] = [
  { id: "ppr", name: "PPR", visual: "ppr-graphic", imageAlt: "Composição gráfica de indicadores em verde", icon: ChartNoAxesCombined, url: "#", openInNewTab: false, accentColor: "yellow", enabled: true },
  { id: "faturamento", name: "Faturamento", image: faturamentoImg, imageAlt: "Documento de fatura sobre a mesa", icon: FileText, url: "#", openInNewTab: false, accentColor: "green", enabled: true },
  { id: "links", name: "Links", visual: "links-graphic", imageAlt: "Ícone de corrente representando links úteis", icon: Link, url: "#", openInNewTab: false, accentColor: "yellow", enabled: true },
  { id: "joy", name: "JOY", image: joyLogo.url, imageAlt: "Logotipo JOY: J vermelho, O verde e Y roxo", icon: Users, url: "#", openInNewTab: false, accentColor: "green", enabled: true },
  { id: "abigail", name: "Abigail", image: abigailImg, imageAlt: "Estação de atendimento com headset e computador", icon: Headset, url: "#", openInNewTab: false, accentColor: "yellow", enabled: true },
];
