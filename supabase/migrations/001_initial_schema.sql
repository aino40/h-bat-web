-- H-BAT Web Application Database Schema
-- Initial migration with support for Audiometry and BST (Perception only)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create custom types
create type test_kind as enum ('audiometry', 'bst_perception');
create type gender_type as enum ('male', 'female', 'other', 'prefer_not_to_say');

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  age smallint not null check (age >= 10 and age <= 100),
  gender gender_type,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tests table (tracks individual test sessions)
create table public.tests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  kind test_kind not null,
  started_at timestamptz default now(),
  finished_at timestamptz,
  created_at timestamptz default now()
);

-- Audiometry results table
create table public.audiometry_results (
  id uuid default uuid_generate_v4() primary key,
  test_id uuid references public.tests(id) on delete cascade not null,
  frequency_hz smallint not null check (frequency_hz in (1000, 2000, 4000)),
  threshold_db numeric(5, 2) not null check (threshold_db >= -10 and threshold_db <= 120),
  created_at timestamptz default now()
);

-- BST (Beat Saliency Test) results table - Perception only
create table public.bst_results (
  id uuid default uuid_generate_v4() primary key,
  test_id uuid references public.tests(id) on delete cascade not null,
  trial_number smallint not null check (trial_number > 0),
  pattern_type text not null check (pattern_type in ('2beat', '3beat')),
  presented_pattern text not null check (presented_pattern in ('2beat', '3beat')),
  user_response text not null check (user_response in ('2beat', '3beat')),
  db_difference numeric(5, 2) not null check (db_difference > 0),
  is_correct boolean not null,
  reaction_time_ms integer check (reaction_time_ms > 0),
  created_at timestamptz default now()
);

-- Final BST thresholds table
create table public.bst_thresholds (
  id uuid default uuid_generate_v4() primary key,
  test_id uuid references public.tests(id) on delete cascade not null,
  perception_threshold_db numeric(5, 2) not null check (perception_threshold_db > 0),
  reversal_points jsonb, -- Store reversal points for analysis
  created_at timestamptz default now()
);

-- Row Level Security (RLS) Policies
alter table public.profiles enable row level security;
alter table public.tests enable row level security;
alter table public.audiometry_results enable row level security;
alter table public.bst_results enable row level security;
alter table public.bst_thresholds enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Tests policies
create policy "Users can view own tests"
  on public.tests for select
  using (auth.uid() = user_id);

create policy "Users can insert own tests"
  on public.tests for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tests"
  on public.tests for update
  using (auth.uid() = user_id);

-- Audiometry results policies
create policy "Users can view own audiometry results"
  on public.audiometry_results for select
  using (
    auth.uid() = (select user_id from public.tests where id = test_id)
  );

create policy "Users can insert own audiometry results"
  on public.audiometry_results for insert
  with check (
    auth.uid() = (select user_id from public.tests where id = test_id)
  );

-- BST results policies
create policy "Users can view own BST results"
  on public.bst_results for select
  using (
    auth.uid() = (select user_id from public.tests where id = test_id)
  );

create policy "Users can insert own BST results"
  on public.bst_results for insert
  with check (
    auth.uid() = (select user_id from public.tests where id = test_id)
  );

-- BST thresholds policies
create policy "Users can view own BST thresholds"
  on public.bst_thresholds for select
  using (
    auth.uid() = (select user_id from public.tests where id = test_id)
  );

create policy "Users can insert own BST thresholds"
  on public.bst_thresholds for insert
  with check (
    auth.uid() = (select user_id from public.tests where id = test_id)
  );

-- Admin policies (for users with admin role)
create policy "Admins can view all data"
  on public.profiles for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

create policy "Admins can view all tests"
  on public.tests for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

create policy "Admins can view all audiometry results"
  on public.audiometry_results for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

create policy "Admins can view all BST results"
  on public.bst_results for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

create policy "Admins can view all BST thresholds"
  on public.bst_thresholds for select
  using (
    exists (
      select 1 from auth.users
      where auth.users.id = auth.uid()
      and auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Create indexes for performance
create index idx_tests_user_id on public.tests(user_id);
create index idx_tests_kind on public.tests(kind);
create index idx_tests_created_at on public.tests(created_at);
create index idx_audiometry_results_test_id on public.audiometry_results(test_id);
create index idx_audiometry_results_frequency on public.audiometry_results(frequency_hz);
create index idx_bst_results_test_id on public.bst_results(test_id);
create index idx_bst_results_trial_number on public.bst_results(trial_number);
create index idx_bst_thresholds_test_id on public.bst_thresholds(test_id);

-- Updated at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to profiles
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at(); 