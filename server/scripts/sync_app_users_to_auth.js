require("../config/env");
const crypto = require("node:crypto");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const usersTable = process.env.SUPABASE_USERS_TABLE || "app_users";

const buildTempPassword = () => {
  const bytes = crypto.randomBytes(12);
  return bytes.toString("base64url").slice(0, 16);
};

const run = async () => {
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
    process.exit(1);
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: users, error: usersError } = await supabaseAdmin
    .from(usersTable)
    .select("id, username, email, role, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (usersError) {
    console.error(`Failed to fetch users from ${usersTable}: ${usersError.message}`);
    process.exit(1);
  }

  let created = 0;
  let exists = 0;
  let skipped = 0;
  let failed = 0;

  for (const user of users || []) {
    if (!user?.id || !user?.email) {
      skipped += 1;
      continue;
    }

    const tempPassword = buildTempPassword();

    const { error } = await supabaseAdmin.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        username: user.username || "",
        role: user.role || "",
      },
    });

    if (!error) {
      created += 1;
      continue;
    }

    const message = (error.message || "").toLowerCase();
    if (message.includes("already") || message.includes("exists") || message.includes("duplicate")) {
      exists += 1;
    } else {
      failed += 1;
      console.error(`Failed for ${user.email}: ${error.message}`);
    }
  }

  console.log("Sync completed.");
  console.log(`Created: ${created}`);
  console.log(`Already existed: ${exists}`);
  console.log(`Skipped (missing email/id): ${skipped}`);
  console.log(`Failed: ${failed}`);
};

run().catch((error) => {
  console.error("Unexpected sync error:", error.message);
  process.exit(1);
});
