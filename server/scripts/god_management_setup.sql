-- Additional schema for God -> College/SuperAdmin management
create extension if not exists pgcrypto;

-- Reuse shared updated_at trigger function if available
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  location text,
  address text,
  established text,
  type text,
  affiliation text,
  phone text,
  email text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.super_admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.app_users(id) on delete cascade,
  college_id uuid not null references public.colleges(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  emp_id text not null unique,
  qualification text,
  experience text,
  specialization text,
  joining_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Labs table used by Admin Lab Management
create table if not exists public.labs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  language text,
  faculty text,
  students jsonb not null default '[]'::jsonb,
  experiments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_colleges_name on public.colleges(name);
create index if not exists idx_colleges_code on public.colleges(code);
create index if not exists idx_super_admin_profiles_college_id on public.super_admin_profiles(college_id);
create index if not exists idx_labs_name on public.labs(name);

drop trigger if exists trg_colleges_updated_at on public.colleges;
create trigger trg_colleges_updated_at
before update on public.colleges
for each row
execute function public.set_updated_at();

drop trigger if exists trg_super_admin_profiles_updated_at on public.super_admin_profiles;
create trigger trg_super_admin_profiles_updated_at
before update on public.super_admin_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_labs_updated_at on public.labs;
create trigger trg_labs_updated_at
before update on public.labs
for each row
execute function public.set_updated_at();

-- Department Heads (HOD) table
create table if not exists public.department_heads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.app_users(id) on delete cascade,
  college_id uuid not null references public.colleges(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  emp_id text not null,
  department_name text not null,
  qualification text,
  experience text,
  specialization text,
  joining_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Department Admins (Assistant) table
create table if not exists public.department_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.app_users(id) on delete cascade,
  college_id uuid not null references public.colleges(id) on delete cascade,
  department_head_id uuid not null references public.department_heads(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  emp_id text not null,
  department_name text not null,
  qualification text,
  experience text,
  joining_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_department_heads_college_id on public.department_heads(college_id);
create index if not exists idx_department_heads_emp_id on public.department_heads(emp_id);
create index if not exists idx_department_admins_college_id on public.department_admins(college_id);
create index if not exists idx_department_admins_department_head_id on public.department_admins(department_head_id);

drop trigger if exists trg_department_heads_updated_at on public.department_heads;
create trigger trg_department_heads_updated_at
before update on public.department_heads
for each row
execute function public.set_updated_at();

drop trigger if exists trg_department_admins_updated_at on public.department_admins;
create trigger trg_department_admins_updated_at
before update on public.department_admins
for each row
execute function public.set_updated_at();

