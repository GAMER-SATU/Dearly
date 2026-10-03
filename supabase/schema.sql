-- ==============================================================================
-- DEARLY KEEPSAKE - SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Copy and paste this script directly into your Supabase Dashboard:
-- Project Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create the `magazines` table
create table if not exists public.magazines (
  id text primary key,
  title text default 'Dearly Keepsake',
  data jsonb not null,
  image_paths text[] default '{}',
  created_at timestamptz default now(),
  expires_at timestamptz not null
);

-- Index for instant ID lookup and fast expiration filtering
create index if not exists idx_magazines_expires_at on public.magazines (expires_at);

-- 2. Enable Row Level Security (RLS)
alter table public.magazines enable row level security;

-- Drop any existing conflicting policies to allow clean re-runs
drop policy if exists "Allow public insert to magazines" on public.magazines;
drop policy if exists "Allow public select of active magazines" on public.magazines;
drop policy if exists "Allow deletion of expired magazines" on public.magazines;

-- Policy: Anyone can create a keepsake
create policy "Allow public insert to magazines"
  on public.magazines
  for insert
  to anon, authenticated
  with check (true);

-- Policy: Anyone can read active keepsakes (expires_at > now)
create policy "Allow public select of active magazines"
  on public.magazines
  for select
  to anon, authenticated
  using (expires_at > now());

-- Policy: Allow deletion of expired keepsakes
create policy "Allow deletion of expired magazines"
  on public.magazines
  for delete
  to anon, authenticated
  using (expires_at <= now());

-- 3. Create the `magazines` Storage Bucket for uploaded photos
insert into storage.buckets (id, name, public)
values ('magazines', 'magazines', true)
on conflict (id) do update set public = true;

-- Storage RLS Policies
drop policy if exists "Public Access to Magazine Images" on storage.objects;
drop policy if exists "Allow Uploads to Magazine Images" on storage.objects;
drop policy if exists "Allow Delete of Magazine Images" on storage.objects;

-- Allow anyone to view photos
create policy "Public Access to Magazine Images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'magazines');

-- Allow photo uploads
create policy "Allow Uploads to Magazine Images"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'magazines');

-- Allow photo deletion on expiration
create policy "Allow Delete of Magazine Images"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'magazines');

-- 4. Automatic 24-Hour Expiration Engine (pg_cron)
-- Enable the native pg_cron extension
create extension if not exists pg_cron;

-- Create cleanup stored procedure
create or replace function public.delete_expired_magazines()
returns void
language plpgsql
security definer
as $$
begin
  -- Automatically delete records where 24 hours have passed
  delete from public.magazines
  where expires_at <= now();
end;
$$;

-- Safely remove existing cron job before scheduling to allow re-runs
do $$
begin
  perform cron.unschedule('auto-delete-expired-magazines');
exception
  when others then null;
end $$;

-- Schedule the cleanup to run every 15 minutes automatically
select cron.schedule(
  'auto-delete-expired-magazines',
  '*/15 * * * *',
  'select public.delete_expired_magazines()'
);
