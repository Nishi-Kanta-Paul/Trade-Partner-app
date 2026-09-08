-- Trade Partner — our own copy of every submission.
--
-- Run this once in the Supabase dashboard: SQL Editor → New query → paste → Run.
-- Everything is insert-only from the app; reading is done with the service role
-- (the dashboard, or a future admin app), never with the key in the phone.

create table if not exists public.submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- which form, and the Jotform it was also sent to
  form            text not null check (form in ('proposal','arrival','departure','recap','invoice')),
  jotform_id      text,

  -- pulled out of the payload so reports don't have to dig through JSON
  partner_name    text,
  partner_company text,
  partner_email   text,
  partner_phone   text,
  project_name    text,
  project_number  text,
  amount          numeric,
  status          text,

  -- everything the partner filled in, and where their media ended up
  payload         jsonb not null,
  files           jsonb not null default '[]'::jsonb
);

create index if not exists submissions_created_at_idx on public.submissions (created_at desc);
create index if not exists submissions_form_idx       on public.submissions (form, created_at desc);
create index if not exists submissions_project_idx    on public.submissions (project_number);

alter table public.submissions enable row level security;

-- A partner's phone may file a submission and nothing else. There is no select
-- policy on purpose: the public anon key cannot read a single row back.
drop policy if exists "app can file submissions" on public.submissions;
create policy "app can file submissions"
  on public.submissions for insert to anon with check (true);


-- ── Media ────────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', false)
on conflict (id) do nothing;

drop policy if exists "app can upload submission media" on storage.objects;
create policy "app can upload submission media"
  on storage.objects for insert to anon
  with check (bucket_id = 'submissions');
