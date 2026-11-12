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
  { id: "csd", name: "CSD", image: csdImg, imageAlt: "Motorista de caminhão ao volante", icon: BadgeCheck, url: "https://dash.logar.cargill.com/safety-domine", openInNewTab: true, accentColor: "green", enabled: true },
  { id: "trp", name: "TRP", description: "Tempo de Pátio", image: trpImg, imageAlt: "Caminhões aguardando no pátio de entrada", icon: Timer, url: "http://10.47.118.239:3210/#GYN/2026-11/Shipping%20Packages%20Truck", openInNewTab: true, accentColor: "yellow", enabled: true },
  { id: "gestao-guiches", name: "Gestão Guichês", image: guichesImg, imageAlt: "Guarita de entrada com cancela", icon: DoorOpen, url: "https://painel.cargill.com/", openInNewTab: true, accentColor: "green", enabled: true },
  { id: "safra", name: "Safra", image: safraImg, imageAlt: "Tomates vermelhos ainda na planta", icon: Leaf, url: "https://app.powerbi.com/groups/dc934504-0c0f-462d-8962-44cd7234cbc6/reports/e4b8b745-bf46-4e12-950d-5ac8d0144c00/98c6f164bd959d043770?language=pt-BR&disableBranding=1&experience=power-bi", openInNewTab: true, accentColor: "yellow", enabled: true },
];

export const secondaryModules: PortalModule[] = [
  { id: "ppr", name: "PPR", visual: "ppr-graphic", imageAlt: "Composição gráfica de indicadores em verde", icon: ChartNoAxesCombined, url: "https://app.powerbi.com/groups/c1fed77a-4a18-4300-9aef-301f2a878d14/reports/e8fce3b0-fcaf-4747-8bb2-90e295ab1c35/89c892da1ab91aa4c36b?experience=power-bi", openInNewTab: true, accentColor: "yellow", enabled: true },
  // PLACEHOLDER: aguardando a URL oficial do Faturamento.
  { id: "faturamento", name: "Faturamento", image: faturamentoImg, imageAlt: "Documento de fatura sobre a mesa", icon: FileText, url: "#", openInNewTab: false, accentColor: "green", enabled: true },
  { id: "links", name: "Links", visual: "links-graphic", imageAlt: "Ícone de corrente representando links úteis", icon: Link, url: "https://hub.cargill.com/", openInNewTab: true, accentColor: "yellow", enabled: true },
  { id: "joy", name: "JOY", image: joyLogo.url, imageAlt: "Logotipo JOY: J vermelho, O verde e Y roxo", icon: Users, url: "https://apps.powerapps.com/play/e/9bc94927-f821-4327-8700-42128a1363c4/a/562c619a-2bfa-4f52-bce3-2e5b3bcd4d02?tenantId=57368c21-b8cf-42cf-bd0b-43ecd4bc62ae&hint=88bada87-f6b6-4f99-a93c-802a4a562956&sourcetime=1715283631915&hidenavbar=true", openInNewTab: true, accentColor: "green", enabled: true },
  { id: "abigail", name: "Abigail", image: abigailImg, imageAlt: "Estação de atendimento com headset e computador", icon: Headset, url: "https://abigail.ia.cargill.com/", openInNewTab: true, accentColor: "yellow", enabled: true },
];
