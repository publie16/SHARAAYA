import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const productsTable = import.meta.env.VITE_SUPABASE_PRODUCTS_TABLE || "products";

export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== "your_supabase_url"
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const hasSupabaseConfig = Boolean(supabase);
export const supabaseProductsTable = productsTable;
