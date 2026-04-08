import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase 相關的環境變數尚未設定，請檢查 .env.local 檔案')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
