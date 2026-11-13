import { z } from "zod";
import { isSafeDestination } from "@/lib/urlValidation";

/** Formulário de login da Área Restrita. */
export const loginSchema = z.object({
  username: z.string().min(1, "Informe o usuário e a senha."),
  password: z.string().min(1, "Informe o usuário e a senha."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
