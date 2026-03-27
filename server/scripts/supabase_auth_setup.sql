-- Enable UUID generator
create extension if not exists pgcrypto;

-- Main users table
create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique,
  password_hash text not null,
  role text not null check (role in ('God', 'SuperAdmin', 'Admin', 'Faculty', 'Student')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Useful indexes
create index if not exists idx_app_users_role on public.app_users(role);
create index if not exists idx_app_users_active on public.app_users(is_active);

-- Auto-update updated_at on row update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_app_users_updated_at on public.app_users;

create trigger trg_app_users_updated_at
before update on public.app_users
for each row
execute function public.set_updated_at();

-- Seed users with simple passwords (already bcrypt-hashed)
-- Plain passwords:
-- God: god123
-- SuperAdmin: super123
-- Admin: admin123
-- Faculty: faculty123
-- Student: student123
insert into public.app_users (username, email, password_hash, role, is_active)
values
  ('god', 'god@example.com', '$2b$10$s5fmamMPO.Ek/actgFU8Xe59Kuv6fMIIecSZV2BYOY2z2NqmxhmO6', 'God', true),
  ('superadmin1', 'superadmin@example.com', '$2b$10$UwWnd5/NuTcpXE58rmCObuGBCFrlEFMDGjwZAlgLy6C.DAVjMJSFa', 'SuperAdmin', true),
  ('admin1', 'admin@example.com', '$2b$10$/o.WL5BvW1mlitqLFgLVOu8VPKHS7zL1NZqMtRn1CYo.q.gixfWxG', 'Admin', true),
  ('faculty1', 'faculty@example.com', '$2b$10$FnPHe4jjEfTreRY70BF1me2zs24A7U0X/87Xb5PBszJCNyebG/Ytu', 'Faculty', true),
  ('student1', 'student@example.com', '$2b$10$IFmbiNF1ZbQ46Vdfb1AVPOczxhQBUjkkbQJ2GITIgfO9/pdEQ.wsm', 'Student', true)
on conflict (username) do update
set
  email = excluded.email,
  password_hash = excluded.password_hash,
  role = excluded.role,
  is_active = excluded.is_active,
  updated_at = now();

God
Username: god
Password: god123

SuperAdmin
Username: superadmin1
Password: super123

Admin
Username: admin1
Password: admin123

Faculty
Username: faculty1
Password: faculty123

Student
Username: student1
Password: student123