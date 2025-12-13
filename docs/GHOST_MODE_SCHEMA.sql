-- GHOST MODE + AUTH SCHEMA FOR SUPABASE
-- Run this in Supabase SQL Editor

-- Create profiles table (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text default 'senior',
  is_subscriber boolean default false,
  subscription_tier text, -- 'monthly' or 'lifetime'
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create sessions table
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  senior_id uuid references auth.users(id),
  status text default 'active',
  last_transcript text,
  current_view text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table sessions enable row level security;

-- Profiles policies
create policy "Profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles can be updated by owner"
  on profiles for update
  using (auth.uid() = id);

create policy "Profiles can be inserted on signup"
  on profiles for insert
  with check (auth.uid() = id);

-- Sessions policies (more permissive for Ghost Mode)
create policy "Sessions are viewable by everyone"
  on sessions for select
  using (true);

create policy "Sessions can be created by anyone"
  on sessions for insert
  with check (true);

create policy "Sessions can be updated by anyone"
  on sessions for update
  using (true);

-- Enable Realtime
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table sessions;

-- Create updated_at triggers
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_sessions_updated_at
  before update on sessions
  for each row
  execute function update_updated_at_column();

-- Create profile automatically on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Success message
select 'Ghost Mode + Auth schema created successfully!' as message;

