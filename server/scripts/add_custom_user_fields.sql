ALTER TABLE app_users
ADD COLUMN IF NOT EXISTS year text,
ADD COLUMN IF NOT EXISTS branch text,
ADD COLUMN IF NOT EXISTS qualification text,
ADD COLUMN IF NOT EXISTS designation text,
ADD COLUMN IF NOT EXISTS specialization text;
