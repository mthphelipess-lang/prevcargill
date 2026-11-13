import { z } from "zod";
import { isSafeDestination } from "@/lib/urlValidation";
import { isStoragePath } from "@/types/card";

const optionalText = z.string().trim().max(150).optional().nullable();

/** Validação do formulário de card (espelha as regras do banco). */
export const cardSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome precisa ter no mínimo 2 caracteres.")
      .max(50, "O nome precisa ter no máximo 50 caracteres."),
    description: z.string().trim().max(150, "A descrição precisa ter no máximo 150 caracteres.").optional().nullable(),
    icon_name: z.string().min(1, "Selecione um ícone."),
    image_url: z.string().trim().max(2048).optional().nullable(),
    image_alt: z.string().trim().max(200, "A descrição da imagem precisa ter no máximo 200 caracteres.").optional().nullable(),
    video_url: z.string().trim().max(2048).optional().nullable(),
    image_fit: z.enum(["cover", "contain"]),
    placeholder_style: z.enum(["icon-muted", "icon-green"]),
    destination_url: z
      .string()
      .trim()
      .min(1, "Informe o endereço de destino do card.")
      .refine(isSafeDestination, "Endereço inválido. Use http://, https://, mailto:, tel:, / ou #."),
    open_in_new_tab: z.boolean(),
    enabled: z.boolean(),
    accent_color: z.enum(["green", "yellow"]),
    display_order: z.coerce
      .number({ invalid_type_error: "Informe a ordem de exibição." })
      .int("A ordem precisa ser um número inteiro.")
      .min(1, "A ordem precisa ser maior que zero."),
    row_group: z.enum(["primary", "secondary"]),
  })
  .superRefine((values, ctx) => {
    if (values.image_url && !values.image_alt?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["image_alt"],
        message: "Informe a descrição da imagem.",
      });
    }
    if (values.video_url && !isSafeDestination(values.video_url) && !isStoragePath(values.video_url)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["video_url"],
        message: "Endereço de vídeo inválido.",
      });
    }
  });

export type CardFormValues = z.infer<typeof cardSchema>;
