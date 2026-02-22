import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan las variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FileRecord {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  owner_user: string;
  last_modified: string;
  created_at: string;
  updated_at: string;
}

export interface ServerConfig {
  id: string;
  server_url: string;
  last_scan: string | null;
  total_files: number;
  created_at: string;
  updated_at: string;
}
