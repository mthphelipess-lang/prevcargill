import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "portal-visit-counted";

type Stats = { current: number; previous: number };

export function VisitCounter() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        const { error } = await supabase.rpc("register_visit");
        if (!error) sessionStorage.setItem(SESSION_KEY, "1");
      }
      const { data } = await supabase.rpc("get_visit_stats");
      const row = Array.isArray(data) ? data[0] : data;
      if (active && row) setStats({ current: Number(row.current_month), previous: Number(row.previous_month) });
    })();
    return () => {
      active = false;
    };
  }, []);

  const fmt = (n?: number) => (n == null ? "…" : n.toLocaleString("pt-BR"));

  return (
    <span className="flex min-h-11 items-center gap-2" aria-live="polite">
      <Eye className="size-5 text-accent" aria-hidden="true" />
      <span>
        Visitas — Mês anterior: {fmt(stats?.previous)} | Mês atual: {fmt(stats?.current)}
      </span>
    </span>
  );
}
