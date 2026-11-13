import {
  BadgeCheck,
  ChartNoAxesCombined,
  ClipboardList,
  Container,
  DoorOpen,
  Factory,
  FileText,
  Flag,
  Forklift,
  Gauge,
  GraduationCap,
  Headset,
  Leaf,
  Link as LinkIcon,
  MapPin,
  Package,
  Route,
  Scale,
  ScanLine,
  Settings,
  ShieldCheck,
  Square,
  Timer,
  Truck,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

/**
 * Ícones permitidos no formulário de card. O nome salvo no banco é a chave
 * usada para recuperar o componente — nada de ícone livre ou emoji.
 */
export const ICON_OPTIONS = [
  { name: "Truck", label: "Caminhão" },
  { name: "Forklift", label: "Empilhadeira" },
  { name: "Container", label: "Contêiner" },
  { name: "Warehouse", label: "Armazém" },
  { name: "Package", label: "Pacote" },
  { name: "DoorOpen", label: "Guarita / porta" },
  { name: "GateIcon", label: "Cancela" },
  { name: "Timer", label: "Cronômetro" },
  { name: "Gauge", label: "Medidor" },
  { name: "ChartNoAxesCombined", label: "Gráfico" },
  { name: "ClipboardList", label: "Lista" },
  { name: "FileText", label: "Documento" },
  { name: "BadgeCheck", label: "Selo" },
  { name: "ShieldCheck", label: "Escudo" },
  { name: "Flag", label: "Bandeira" },
  { name: "Leaf", label: "Folha" },
  { name: "Factory", label: "Fábrica" },
  { name: "MapPin", label: "Local" },
  { name: "Route", label: "Rota" },
  { name: "Scale", label: "Balança" },
  { name: "ScanLine", label: "Leitura" },
  { name: "GraduationCap", label: "Treinamento" },
  { name: "Headset", label: "Atendimento" },
  { name: "Users", label: "Pessoas" },
  { name: "Link", label: "Link" },
  { name: "Settings", label: "Configurações" },
] as const;

const ICONS: Record<string, LucideIcon> = {
  Truck,
  Forklift,
  Container,
  Warehouse,
  Package,
  DoorOpen,
  Timer,
  Gauge,
  ChartNoAxesCombined,
  ClipboardList,
  FileText,
  BadgeCheck,
  ShieldCheck,
  Flag,
  Leaf,
  Factory,
  MapPin,
  Route,
  Scale,
  ScanLine,
  GraduationCap,
  Headset,
  Users,
  Link: LinkIcon,
  Settings,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Square;
}

export function isKnownIcon(name: string): boolean {
  return name in ICONS;
}
