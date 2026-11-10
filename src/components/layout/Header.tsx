import { Bell, CalendarDays, ChevronDown, CircleUserRound } from "lucide-react";
import { BrandBanner } from "./BrandBanner";
import { useCurrentDateTime } from "@/hooks/useCurrentDateTime";
import { usePortalUser } from "@/hooks/usePortalUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { dateLabel, timeLabel } = useCurrentDateTime();
  const user = usePortalUser();
  const count = user.notificationCount;

  return (
    <header className="relative h-[104px] w-full border-b-4 border-primary md:h-[132px] xl:h-[152px]">
      <BrandBanner />
      <div className="relative flex h-full items-start justify-end p-2 md:p-4">
        <div className="flex items-center gap-1 rounded-xl bg-background/95 px-2 py-1 text-[15px] font-medium text-foreground shadow-card md:gap-2 md:px-4 md:py-2 lg:text-base">
          <span className="hidden items-center gap-2 lg:flex">
            <CalendarDays className="size-5 text-primary" aria-hidden="true" />
            <span>{dateLabel}</span>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          </span>
          <time className="px-1 tabular-nums" aria-label={`Hora atual ${timeLabel}`}>
            {timeLabel}
          </time>
          <button
            type="button"
            className="relative flex size-11 items-center justify-center rounded-full hover:bg-muted"
            aria-label={count > 0 ? `Notificações: ${count} não lidas` : "Notificações"}
          >
            <Bell className="size-5" aria-hidden="true" />
            {count > 0 && (
              <span className="absolute right-1.5 top-1.5 flex min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold leading-[18px] text-primary-foreground">
                {count}
              </span>
            )}
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex min-h-11 items-center gap-2 rounded-full px-2 hover:bg-muted"
              aria-label={`Menu do usuário ${user.name}`}
            >
              <CircleUserRound className="size-7 text-primary" aria-hidden="true" />
              <span className="hidden sm:inline">{user.name}</span>
              <ChevronDown className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="lg:hidden">{dateLabel}</DropdownMenuItem>
              <DropdownMenuItem disabled>Perfil (em breve)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
