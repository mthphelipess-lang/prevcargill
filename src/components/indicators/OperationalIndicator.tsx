import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = { icon: LucideIcon; label: string; value?: string | null; loading?: boolean; isHeading?: boolean };

export function OperationalIndicator({ icon: Icon, label, value, loading, isHeading }: Props) {
  const missing = value === null || value === undefined || value === "";
  return (
    <div className="flex min-h-[72px] items-center gap-3 px-4 py-3">
      <span className={isHeading ? "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground" : "flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary"}>
        <Icon className="size-6" aria-hidden="true" />
      </span>
      {isHeading ? (
        <h2 className="text-base font-bold leading-tight text-primary-dark">{label}</h2>
      ) : (
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-1 h-7 w-20" />
          ) : (
            <p className="text-[26px] font-bold leading-tight text-foreground">
              {missing ? (
                <>
                  <span aria-hidden="true">--</span>
                  <span className="sr-only">Dado não disponível</span>
                </>
              ) : (
                value
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
