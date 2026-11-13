-- Área Restrita: perfis, roles, cards do portal e registro de atividades

create type public.app_role as enum ('admin');

-- ============ profiles ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ user_roles ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============ helpers (depois das tabelas) ============
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin') $$;

-- ============ policies: profiles e user_roles ============
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "user_roles_select_own_or_admin" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

-- ============ portal_cards ============
create table public.portal_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 50),
  description text check (description is null or char_length(description) <= 150),
  icon_name text not null,
  image_url text,
  image_alt text,
  video_url text,
  image_fit text not null default 'cover' check (image_fit in ('cover','contain')),
  placeholder_style text not null default 'icon-muted' check (placeholder_style in ('icon-muted','icon-green')),
  destination_url text not null check (
    destination_url = '#'
    or destination_url ~* '^(https?://|/|mailto:|tel:)'
  ),
  open_in_new_tab boolean not null default false,
  enabled boolean not null default true,
  accent_color text not null default 'green' check (accent_color in ('green','yellow')),
  display_order integer not null check (display_order > 0),
  row_group text not null default 'secondary' check (row_group in ('primary','secondary')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null
);

GRANT SELECT ON public.portal_cards TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portal_cards TO authenticated;
GRANT ALL ON public.portal_cards TO service_role;
ALTER TABLE public.portal_cards ENABLE ROW LEVEL SECURITY;

create policy "cards_select_enabled_or_admin" on public.portal_cards
  for select to anon, authenticated using (enabled = true or public.is_admin());
create policy "cards_insert_admin" on public.portal_cards
  for insert to authenticated with check (public.is_admin());
create policy "cards_update_admin" on public.portal_cards
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "cards_delete_admin" on public.portal_cards
  for delete to authenticated using (public.is_admin());

-- ============ admin_activity_logs ============
create table public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null check (action in
    ('card_created','card_updated','card_enabled','card_disabled','card_deleted','password_changed','login_success','logout')),
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT ON public.admin_activity_logs TO authenticated;
GRANT ALL ON public.admin_activity_logs TO service_role;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

create policy "logs_select_admin" on public.admin_activity_logs
  for select to authenticated using (public.is_admin());
create policy "logs_insert_own_admin" on public.admin_activity_logs
  for insert to authenticated with check (user_id = auth.uid() and public.is_admin());

-- ============ updated_at ============
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger portal_cards_touch_updated before update on public.portal_cards
  for each row execute function public.touch_updated_at();
create trigger profiles_touch_updated before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ============ perfil automático no cadastro ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(nullif(split_part(coalesce(new.email,''),'@',1),''), new.id::text),
    coalesce(nullif(new.raw_user_meta_data->>'display_name',''), nullif(split_part(coalesce(new.email,''),'@',1),''))
  )
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ storage: bucket privado de imagens dos cards ============
create policy "card_images_select_admin" on storage.objects
  for select to authenticated using (bucket_id = 'portal-card-images' and public.is_admin());
create policy "card_images_insert_admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'portal-card-images' and public.is_admin());
create policy "card_images_update_admin" on storage.objects
  for update to authenticated using (bucket_id = 'portal-card-images' and public.is_admin());
create policy "card_images_delete_admin" on storage.objects
  for delete to authenticated using (bucket_id = 'portal-card-images' and public.is_admin());

-- ============ dados iniciais: os 9 cards atuais ============
insert into public.portal_cards
  (name, description, icon_name, image_url, image_alt, video_url, image_fit, placeholder_style, destination_url, open_in_new_tab, enabled, accent_color, display_order, row_group)
values
  ('CSD', null, 'BadgeCheck', '/__l5e/assets-v1/8c2a4270-b34c-47b1-bd24-08db0d1cb5d0/module-csd.jpg', 'Motorista de caminhão ao volante', null, 'cover', 'icon-muted', 'https://dash.logar.cargill.com/safety-domine', true, true, 'green', 1, 'primary'),
  ('TRP', 'Tempo de Pátio', 'Timer', '/__l5e/assets-v1/46af30a1-6abf-4602-b659-883acf120f96/module-trp.jpg', 'Caminhões aguardando no pátio de entrada', null, 'cover', 'icon-muted', 'http://10.47.118.239:3210/#GYN/2026-11/Shipping%20Packages%20Truck', true, true, 'yellow', 2, 'primary'),
  ('Gestão Guichês', null, 'DoorOpen', '/__l5e/assets-v1/84589e0d-c928-4eb7-84a5-d71abb27e234/module-guiches.jpg', 'Guarita de entrada com cancela', null, 'cover', 'icon-muted', 'https://painel.cargill.com/', true, true, 'green', 3, 'primary'),
  ('Safra', null, 'Leaf', '/__l5e/assets-v1/9ad04a1a-77a8-4025-9cd5-dcbb48f87b23/module-safra.jpg', 'Tomates vermelhos ainda na planta', null, 'cover', 'icon-muted', 'https://app.powerbi.com/groups/dc934504-0c0f-462d-8962-44cd7234cbc6/reports/e4b8b745-bf46-4e12-950d-5ac8d0144c00/98c6f164bd959d043770?language=pt-BR&disableBranding=1&experience=power-bi', true, true, 'yellow', 4, 'primary'),
  ('PPR', null, 'ChartNoAxesCombined', null, 'Composição gráfica de indicadores em verde', null, 'cover', 'icon-green', 'https://app.powerbi.com/groups/c1fed77a-4a18-4300-9aef-301f2a878d14/reports/e8fce3b0-fcaf-4747-8bb2-90e295ab1c35/89c892da1ab91aa4c36b?experience=power-bi', true, true, 'yellow', 1, 'secondary'),
  ('Faturamento', null, 'FileText', '/__l5e/assets-v1/d359625d-f45a-402f-b407-fe653adc498b/module-faturamento.jpg', 'Documento de fatura sobre a mesa', null, 'cover', 'icon-muted', '#', false, true, 'green', 2, 'secondary'),
  ('Links', null, 'Link', null, 'Ícone de corrente representando links úteis', null, 'cover', 'icon-muted', 'https://hub.cargill.com/', true, true, 'yellow', 3, 'secondary'),
  ('JOY', null, 'Users', '/__l5e/assets-v1/ccd565f7-1786-4971-a0db-e1960270be4e/logo-joy.png', 'Logotipo JOY: J vermelho, O verde e Y roxo', null, 'contain', 'icon-muted', 'https://apps.powerapps.com/play/e/9bc94927-f821-4327-8700-42128a1363c4/a/562c619a-2bfa-4f52-bce3-2e5b3bcd4d02?tenantId=57368c21-b8cf-42cf-bd0b-43ecd4bc62ae&hint=88bada87-f6b6-4f99-a93c-802a4a562956&sourcetime=1715283631915&hidenavbar=true', true, true, 'green', 4, 'secondary'),
  ('Abigail', null, 'Headset', '/__l5e/assets-v1/74048043-4208-43a1-9278-593147aa834a/module-abigail.jpg', 'Vídeo de demonstração da Abigail', '/__l5e/assets-v1/20590584-74ab-4562-aa70-64ab1d5d7089/video-abigail.mp4', 'cover', 'icon-muted', 'https://abigail.ia.cargill.com/', true, true, 'yellow', 5, 'secondary');