-- good-timer access codes: a code is an account. Codes are issued by the admin (no self sign-up).
-- Devices sign in anonymously; redeeming a code links that device to the code's account.

create table public.gt_access_codes (
  code text primary key check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  label text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.gt_access_codes enable row level security;   -- no policies: never readable by clients

create table public.gt_code_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code text not null references public.gt_access_codes(code) on delete cascade,
  joined_at timestamptz not null default now()
);
alter table public.gt_code_members enable row level security;
create policy "gt_code_members own row" on public.gt_code_members
  for select to authenticated using (user_id = (select auth.uid()));
grant select on public.gt_code_members to authenticated;

alter table public.gt_sessions add column account_code text references public.gt_access_codes(code) on delete cascade;
create index gt_sessions_account_started_idx on public.gt_sessions (account_code, started_at desc);

create or replace function public.gt_my_code() returns text
language sql stable security definer set search_path = '' as $$
  select code from public.gt_code_members where user_id = auth.uid()
$$;
revoke all on function public.gt_my_code() from public, anon;
grant execute on function public.gt_my_code() to authenticated;

drop policy "gt_sessions owner select" on public.gt_sessions;
drop policy "gt_sessions owner insert" on public.gt_sessions;
drop policy "gt_sessions owner delete" on public.gt_sessions;
create policy "gt_sessions account select" on public.gt_sessions
  for select to authenticated using (account_code is not null and account_code = (select public.gt_my_code()));
create policy "gt_sessions account insert" on public.gt_sessions
  for insert to authenticated with check (user_id = (select auth.uid()) and account_code = (select public.gt_my_code()));
create policy "gt_sessions account delete" on public.gt_sessions
  for delete to authenticated using (account_code is not null and account_code = (select public.gt_my_code()));

create or replace function public.gt_redeem(p_code text) returns boolean
language plpgsql security definer set search_path = '' as $$
declare c text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not exists (select 1 from public.gt_access_codes where code = c and active) then
    perform pg_sleep(0.8);
    return false;
  end if;
  insert into public.gt_code_members (user_id, code) values (auth.uid(), c)
    on conflict (user_id) do update set code = excluded.code, joined_at = now();
  update public.gt_sessions set account_code = c where user_id = auth.uid() and account_code is null;
  return true;
end $$;
revoke all on function public.gt_redeem(text) from public, anon;
grant execute on function public.gt_redeem(text) to authenticated;

-- admin-only (SQL editor): select public.gt_new_code('label');
create or replace function public.gt_new_code(p_label text default null) returns text
language plpgsql security definer set search_path = '' as $$
declare alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; c text; idx int; b bytea;
begin
  loop
    b := uuid_send(gen_random_uuid());
    c := '';
    foreach idx in array array[0, 1, 2, 3, 4, 5, 9, 10] loop
      c := c || substr(alphabet, 1 + (get_byte(b, idx) % 32), 1);
    end loop;
    exit when not exists (select 1 from public.gt_access_codes where code = c);
  end loop;
  insert into public.gt_access_codes (code, label) values (c, p_label);
  return c;
end $$;
revoke all on function public.gt_new_code(text) from public, anon, authenticated;
