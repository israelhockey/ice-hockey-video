create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create table public.breakdown_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  team_org text,
  video_url text not null,
  span text not null,
  period text,
  range_from text,
  range_to text,
  home_team text not null,
  home_color text,
  away_team text not null,
  away_color text,
  goalies text,
  roster_text text,
  roster_file_path text,
  notes text,
  status text not null default 'new',
  filmroom_url text,
  created_at timestamptz not null default now()
);
grant insert on public.breakdown_requests to anon, authenticated;
grant select, update, delete on public.breakdown_requests to authenticated;
grant all on public.breakdown_requests to service_role;
alter table public.breakdown_requests enable row level security;
create policy "Anyone can submit a request" on public.breakdown_requests for insert to anon, authenticated
  with check (status = 'new' and filmroom_url is null);
create policy "Admins read requests" on public.breakdown_requests for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update requests" on public.breakdown_requests for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete requests" on public.breakdown_requests for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  role text,
  film_room text,
  names_right_1to5 smallint check (names_right_1to5 between 1 and 5),
  useful_1to5 smallint check (useful_1to5 between 1 and 5),
  what_worked text,
  whats_wrong text,
  what_to_add text,
  would_pay text,
  created_at timestamptz not null default now()
);
grant insert on public.feedback to anon, authenticated;
grant select, delete on public.feedback to authenticated;
grant all on public.feedback to service_role;
alter table public.feedback enable row level security;
create policy "Anyone can send feedback" on public.feedback for insert to anon, authenticated with check (true);
create policy "Admins read feedback" on public.feedback for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete feedback" on public.feedback for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Anyone can upload a roster" on storage.objects for insert to anon, authenticated with check (bucket_id = 'rosters');
create policy "Admins read rosters" on storage.objects for select to authenticated using (bucket_id = 'rosters' and public.has_role(auth.uid(), 'admin'));