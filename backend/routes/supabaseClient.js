import { createClient } from "@supabase/supabase-js";
// routes/supabaseClient.js
import dotenv from "dotenv";
dotenv.config(); // 🔥 Esto asegura que las envs estén disponibles acá
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default supabase;