import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { cardSchema } from "@/schemas/cardSchema";
import { isStoragePath, type CardDraft, type CardRow } from "@/types/card";
import { z } from "zod";

const BUCKET = "portal-card-images";
/** URL temporária: 1h. Usada só para exibir a imagem privada. */
const SIGN_TTL_SECONDS = 60 * 60;

const CARD_COLUMNS =
  "id, name, description, icon_name, image_url, image_alt, video_url, image_fit, placeholder_style, destination_url, open_in_new_tab, enabled, accent_color, display_order, row_group, created_at, updated_at, created_by, updated_by" as const;

/** Card com a URL de exibição resolvida + o valor original salvo no banco. */
export type CardWithImage = CardRow & { image_source_url: string | null };

type AuthedContext = { supabase: SupabaseClient<Database>; userId: string };

export type CardAction = "login_success" | "logout" | "password_changed";

/**
 * Cliente público somente-leitura. Usado durante o SSR da página inicial,
 * onde não existe token de usuário.
 */
function publishableClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/** Converte o caminho do armazenamento privado em URL temporária de exibição. */
async function signImage(value: string | null): Promise<string | null> {
  if (!isStoragePath(value)) return value;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(value, SIGN_TTL_SECONDS);
  return data?.signedUrl ?? null;
}

async function withSignedImages(rows: CardRow[]): Promise<CardWithImage[]> {
  return Promise.all(
    rows.map(async (row) => ({
      ...row,
      image_source_url: row.image_url,
      image_url: await signImage(row.image_url),
    })),
  );
}

/** Confirma o papel de administrador do usuário da sessão. */
async function assertAdmin(supabase: SupabaseClient<Database>, userId: string): Promise<void> {
  const { data, error } = await supabase.rpc("is_admin");
  if (error || !data) throw new Error("Acesso restrito a administradores.");
  void userId;
}

async function logEvent(
  context: AuthedContext,
  action: CardAction | "card_created" | "card_updated" | "card_enabled" | "card_disabled" | "card_deleted",
  card?: Pick<CardRow, "id" | "name" | "destination_url" | "enabled">,
): Promise<void> {
  await context.supabase.from("admin_activity_logs").insert({
    user_id: context.userId,
    action,
    entity_type: card ? "portal_card" : null,
    entity_id: card?.id ?? null,
    details: card ? { name: card.name, destination_url: card.destination_url, enabled: card.enabled } : null,
  });
}

function normalizeDraft(draft: CardDraft): Record<string, unknown> {
  return {
    name: draft.name.trim(),
    description: draft.description?.trim() ? draft.description.trim() : null,
    icon_name: draft.icon_name,
    image_url: draft.image_url?.trim() ? draft.image_url.trim() : null,
    image_alt: draft.image_url?.trim() && draft.image_alt?.trim() ? draft.image_alt.trim() : null,
    video_url: draft.video_url?.trim() ? draft.video_url.trim() : null,
    image_fit: draft.image_fit,
    placeholder_style: draft.placeholder_style,
    destination_url: draft.destination_url.trim(),
    open_in_new_tab: draft.open_in_new_tab,
    enabled: draft.enabled,
    accent_color: draft.accent_color,
    display_order: draft.display_order,
    row_group: draft.row_group,
  };
}

const cardWithIdSchema = cardSchema.extend({ id: z.string().uuid() });

/** Cards publicados — usados pela página inicial (SSR e navegação). */
export const listPortalCards = createServerFn({ method: "GET" }).handler(async (): Promise<CardWithImage[]> => {
  const supabasePublic = publishableClient();
  const { data, error } = await supabasePublic
    .from("portal_cards")
    .select(CARD_COLUMNS)
    .eq("enabled", true)
    .order("row_group", { ascending: true })
    .order("display_order", { ascending: true });

  if (error) throw new Error("Não foi possível carregar os cards do portal.");
  // Só imagens de cards já publicados têm URL assinada; URLs públicas passam direto.
  return withSignedImages((data ?? []) as CardRow[]);
});

/** Todos os cards, inclusive indisponíveis — somente administradores. */
export const listAdminCards = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CardWithImage[]> => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("portal_cards")
      .select(CARD_COLUMNS)
      .order("row_group", { ascending: true })
      .order("display_order", { ascending: true });
    if (error) throw new Error("Não foi possível carregar os cards.");
    return withSignedImages((data ?? []) as CardRow[]);
  });

export const getAdminCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }): Promise<CardWithImage | null> => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("portal_cards")
      .select(CARD_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error("Não foi possível carregar o card.");
    if (!row) return null;
    const [signed] = await withSignedImages([row as CardRow]);
    return signed;
  });

export const createCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CardDraft) => cardSchema.parse(input))
  .handler(async ({ data, context }): Promise<CardWithImage> => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("portal_cards")
      .insert({ ...normalizeDraft(data), created_by: context.userId, updated_by: context.userId })
      .select(CARD_COLUMNS)
      .single();
    if (error || !row) throw new Error("Não foi possível salvar o card.");
    await logEvent(context, "card_created", row as CardRow);
    const [signed] = await withSignedImages([row as CardRow]);
    return signed;
  });

export const updateCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: CardDraft & { id: string }) => cardWithIdSchema.parse(input))
  .handler(async ({ data, context }): Promise<CardWithImage> => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...draft } = data;
    const { data: row, error } = await context.supabase
      .from("portal_cards")
      .update({ ...normalizeDraft(draft), updated_by: context.userId })
      .eq("id", id)
      .select(CARD_COLUMNS)
      .maybeSingle();
    if (error || !row) throw new Error("Não foi possível salvar o card.");
    await logEvent(context, "card_updated", row as CardRow);
    const [signed] = await withSignedImages([row as CardRow]);
    return signed;
  });

export const setCardEnabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; enabled: boolean }) => input)
  .handler(async ({ data, context }): Promise<CardWithImage | null> => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await context.supabase
      .from("portal_cards")
      .update({ enabled: data.enabled, updated_by: context.userId })
      .eq("id", data.id)
      .select(CARD_COLUMNS)
      .maybeSingle();
    if (error || !row) throw new Error("Não foi possível atualizar o card.");
    await logEvent(context, data.enabled ? "card_enabled" : "card_disabled", row as CardRow);
    const [signed] = await withSignedImages([row as CardRow]);
    return signed;
  });

export const deleteCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertAdmin(context.supabase, context.userId);
    const { data: existing } = await context.supabase
      .from("portal_cards")
      .select("id, name, image_url, destination_url, enabled")
      .eq("id", data.id)
      .maybeSingle();
    if (!existing) return { ok: true };

    const { error } = await context.supabase.from("portal_cards").delete().eq("id", data.id);
    if (error) throw new Error("Não foi possível excluir o card.");

    if (isStoragePath(existing.image_url)) {
      await context.supabase.storage.from(BUCKET).remove([existing.image_url]);
    }
    await logEvent(context, "card_deleted", existing as CardRow);
    return { ok: true };
  });

/** URL temporária para o formulário exibir uma imagem privada já salva. */
export const resolveCardImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { value: string }) => input)
  .handler(async ({ data, context }): Promise<{ url: string | null }> => {
    await assertAdmin(context.supabase, context.userId);
    return { url: await signImage(data.value) };
  });

/** Registro de login, logout e troca de senha. */
export const logAuthEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { action: CardAction }) => input)
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await logEvent(context, data.action);
    return { ok: true };
  });
