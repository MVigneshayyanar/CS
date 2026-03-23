# Supabase Auth Setup

This project expects login users to be stored in a Supabase table.

## 1. Create users table

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique,
  password_hash text not null,
  role text not null check (role in ('God', 'SuperAdmin', 'Admin', 'Faculty', 'Student')),
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now()
);
```

## 2. Insert users with hashed password

Passwords must be bcrypt hashes. Generate hash in server folder:

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('your-password',10).then(console.log)"
```

Then insert in Supabase:

```sql
insert into public.app_users (username, email, password_hash, role)
values
  ('god', 'god@example.com', '$2a$10$replaceWithHash', 'God'),
  ('superadmin1', 'superadmin@example.com', '$2a$10$replaceWithHash', 'SuperAdmin'),
  ('admin1', 'admin@example.com', '$2a$10$replaceWithHash', 'Admin'),
  ('faculty1', 'faculty@example.com', '$2a$10$replaceWithHash', 'Faculty'),
  ('student1', 'student@example.com', '$2a$10$replaceWithHash', 'Student');
```

## 3. Environment variables

Configure in server .env:

- SUPABASE_URL
- SUPABASE_KEY
- SUPABASE_USERS_TABLE=app_users
- JWT_SECRET
- JWT_EXPIRES_IN
- CLIENT_ORIGIN

## 4. Login behavior

- God portal allows role God only.
- Student portal allows role Student only.
- Staff portal allows role Faculty, Admin, SuperAdmin.

All successful logins return a JWT token used for protected routes.

## 5. God dashboard tables (required for Add College / Add Super Admin)

Run this script in Supabase SQL Editor:

- `server/scripts/god_management_setup.sql`

If you see errors like `Could not find the table 'public.colleges' in the schema cache`, this script has not been applied (or Supabase schema cache has not refreshed yet). Apply the script, wait a few seconds, then retry.

