import { AlertTriangle } from "lucide-react";

export function ErrorState({ message = "Ocorreu um erro ao carregar os dados." }: { message?: string }) {
  return (
    <p role="alert" className="flex items-center gap-2 p-4 text-sm text-danger">
      <AlertTriangle className="size-4" aria-hidden="true" />
      {message}
    </p>
  );
}
