/** Linha da tabela public.portal_cards (fonte de verdade dos cards). */
export type CardRow = {
  id: string;
  name: string;
  description: string | null;
  icon_name: string;
  image_url: string | null;
  image_alt: string | null;
  video_url: string | null;
  image_fit: ImageFit;
  placeholder_style: PlaceholderStyle;
  destination_url: string;
  open_in_new_tab: boolean;
  enabled: boolean;
  accent_color: AccentColor;
  display_order: number;
  row_group: CardGroup;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

/** Valores editáveis do formulário de card. */
export type CardDraft = Omit<CardRow, "id" | "created_at" | "updated_at" | "created_by" | "updated_by">;

/** O que a reprodução visual do card precisa — serve para linha do banco e rascunho. */
export type CardVisual = Pick<
  CardRow,
  | "name"
  | "description"
  | "icon_name"
  | "image_url"
  | "image_alt"
  | "video_url"
  | "image_fit"
  | "placeholder_style"
  | "destination_url"
  | "open_in_new_tab"
  | "enabled"
  | "accent_color"
>;

export function draftToVisual(draft: CardDraft): CardVisual {
  return {
    name: draft.name,
    description: draft.description,
    icon_name: draft.icon_name,
    image_url: draft.image_url,
    image_alt: draft.image_alt,
    video_url: draft.video_url,
    image_fit: draft.image_fit,
    placeholder_style: draft.placeholder_style,
    destination_url: draft.destination_url,
    open_in_new_tab: draft.open_in_new_tab,
    enabled: draft.enabled,
    accent_color: draft.accent_color,
  };
}

export type CardGroup = "primary" | "secondary";
export type AccentColor = "green" | "yellow";
export type ImageFit = "cover" | "contain";
export type PlaceholderStyle = "icon-muted" | "icon-green";

/** Prefixo dos arquivos enviados ao armazenamento privado de imagens. */
export const STORAGE_PREFIX = "cards/";

export function isStoragePath(value: string | null | undefined): value is string {
  return typeof value === "string" && value.startsWith(STORAGE_PREFIX);
}

export const EMPTY_CARD_DRAFT: CardDraft = {
  name: "",
  description: "",
  icon_name: "Truck",
  image_url: null,
  image_alt: "",
  video_url: null,
  image_fit: "cover",
  placeholder_style: "icon-muted",
  destination_url: "",
  open_in_new_tab: true,
  enabled: true,
  accent_color: "green",
  display_order: 1,
  row_group: "secondary",
};

export function toCardDraft(card: CardRow): CardDraft {
  const { id: _id, created_at: _c, updated_at: _u, created_by: _cb, updated_by: _ub, ...draft } = card;
  return draft;
}
