-- allow editing a saved session (per-set weight / reps) within the same account
grant update on public.gt_sessions to authenticated;
create policy "gt_sessions account update" on public.gt_sessions
  for update to authenticated
  using (account_code is not null and account_code = (select public.gt_my_code()))
  with check (account_code = (select public.gt_my_code()));
