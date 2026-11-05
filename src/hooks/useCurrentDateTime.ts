import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Data/hora atual, atualizada a cada virada de minuto. null até hidratar (evita divergência SSR). */
export function useCurrentDateTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return {
    now,
    dateLabel: now ? capitalize(format(now, "EEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })) : "",
    timeLabel: now ? format(now, "HH:mm") : "--:--",
  };
}
