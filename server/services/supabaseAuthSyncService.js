const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const syncUserToSupabaseAuth = async ({ id, email, password, username, role }) => {
  if (!supabaseAdmin || !email || !password) {
    return { synced: false, reason: "SUPABASE_SERVICE_ROLE_KEY missing or required fields missing" };
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    id,
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username: username || "",
      role: role || "",
    },
  });

  if (error) {
    const message = (error.message || "").toLowerCase();
    const isAlreadyExists =
      message.includes("already") ||
      message.includes("exists") ||
      message.includes("duplicate");

    if (isAlreadyExists) {
      return { synced: false, reason: "Auth user already exists" };
    }

    return { synced: false, reason: error.message };
  }

  return { synced: true, authUserId: data?.user?.id || null };
};

const deleteUserFromSupabaseAuth = async (userId) => {
  if (!supabaseAdmin || !userId) {
    return { deleted: false, reason: "SUPABASE_SERVICE_ROLE_KEY missing or userId missing" };
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    return { deleted: false, reason: error.message };
  }

  return { deleted: true };
};

module.exports = {
  syncUserToSupabaseAuth,
  deleteUserFromSupabaseAuth,
};
