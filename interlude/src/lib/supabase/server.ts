import "server-only";
import { createClient } from "@supabase/supabase-js";

// Fallback solo para que el build funcione antes de completar .env.local;
// con esos valores, cualquier llamada real a Supabase fallará en runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});
