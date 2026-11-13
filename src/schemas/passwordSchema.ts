import { z } from "zod";

/** Regras da nova senha: mínimo 10, maiúscula, minúscula, número e especial. */
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual."),
    newPassword: z
      .string()
      .min(10, "A nova senha precisa ter no mínimo 10 caracteres.")
      .regex(/[A-Z]/, "A nova senha precisa conter letra maiúscula.")
      .regex(/[a-z]/, "A nova senha precisa conter letra minúscula.")
      .regex(/[0-9]/, "A nova senha precisa conter número.")
      .regex(/[^A-Za-z0-9]/, "A nova senha precisa conter caractere especial."),
    confirmPassword: z.string().min(1, "Confirme a nova senha."),
  })
  .superRefine((values, ctx) => {
    if (values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "A confirmação não corresponde à nova senha.",
      });
    }
    if (values.currentPassword && values.newPassword === values.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "A nova senha precisa ser diferente da senha atual.",
      });
    }
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
