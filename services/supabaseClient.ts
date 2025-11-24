import { createClient } from '@supabase/supabase-js';

// Tenta pegar as variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

// Se as chaves não existirem (ex: ambiente local sem .env configurado),
// o cliente será criado mas as chamadas falharão graciosamente,
// permitindo que o App.tsx use os dados de Mock como fallback.
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;
