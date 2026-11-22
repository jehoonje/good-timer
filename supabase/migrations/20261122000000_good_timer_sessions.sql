-- good-timer: shares the Digger Supabase project; all objects are prefixed gt_.
create table public.gt_sessions (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  exercise_id text not null,
  exercise_name text not null,
  body_part text not null check (body_part in ('back','chest','shoulder','legs')),
  equipment text,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_ms integer not null check (duration_ms >= 0),
  set_count smallint not null check (set_count >= 0),
  sets jsonb not null default '[]'::jsonb,
  breaks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
comment on table public.gt_sessions is 'good-timer: one row per finished exercise session (sets + breaks as jsonb). Owner-only via RLS.';

create index gt_sessions_user_started_idx on public.gt_sessions (user_id, started_at desc);
create index gt_sessions_user_exercise_idx on public.gt_sessions (user_id, exercise_id);

alter table public.gt_sessions enable row level security;

create policy "gt_sessions owner select" on public.gt_sessions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "gt_sessions owner insert" on public.gt_sessions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "gt_sessions owner delete" on public.gt_sessions
  for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, delete on public.gt_sessions to authenticated;
revoke all on public.gt_sessions from anon;
