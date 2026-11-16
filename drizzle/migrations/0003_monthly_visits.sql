CREATE TABLE public.site_visits_monthly (month date PRIMARY KEY, total bigint NOT NULL DEFAULT 0);
GRANT ALL ON public.site_visits_monthly TO service_role;
ALTER TABLE public.site_visits_monthly ENABLE ROW LEVEL SECURITY;
INSERT INTO public.site_visits_monthly (month, total)
  SELECT date_trunc('month', now() AT TIME ZONE 'America/Sao_Paulo')::date, total FROM public.site_visits WHERE id = 1;

CREATE OR REPLACE FUNCTION public.register_visit() RETURNS bigint LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m date := date_trunc('month', now() AT TIME ZONE 'America/Sao_Paulo')::date; t bigint;
BEGIN
  UPDATE public.site_visits SET total = total + 1 WHERE id = 1;
  INSERT INTO public.site_visits_monthly (month, total) VALUES (m, 1)
    ON CONFLICT (month) DO UPDATE SET total = site_visits_monthly.total + 1
    RETURNING total INTO t;
  RETURN t;
END $$;

CREATE OR REPLACE FUNCTION public.get_visit_stats() RETURNS TABLE(current_month bigint, previous_month bigint) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH m AS (SELECT date_trunc('month', now() AT TIME ZONE 'America/Sao_Paulo')::date AS cur)
  SELECT
    COALESCE((SELECT total FROM public.site_visits_monthly, m WHERE month = m.cur), 0),
    COALESCE((SELECT total FROM public.site_visits_monthly, m WHERE month = (m.cur - interval '1 month')::date), 0);
$$;
REVOKE ALL ON FUNCTION public.get_visit_stats() FROM public;
GRANT EXECUTE ON FUNCTION public.get_visit_stats() TO anon, authenticated;