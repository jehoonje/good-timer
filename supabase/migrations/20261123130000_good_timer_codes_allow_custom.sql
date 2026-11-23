-- allow admin-chosen codes using any letters/digits (generated codes still avoid 0/1/I/O)
alter table public.gt_access_codes drop constraint gt_access_codes_code_check;
alter table public.gt_access_codes add constraint gt_access_codes_code_check check (code ~ '^[A-Z0-9]{8}$');
