import { createClient } from "@supabase/supabase-js";

// Fallback solo para que el build funcione antes de completar .env.local;
// con esos valores, cualquier llamada real a Supabase fallará en runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
