import { createClient } from '@supabase/supabase-js'

/**
 * 創建伺服器端 Supabase 客戶端（使用 anon key）
 * 用於 Server Components 和 API Routes
 */
export function createServerClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
    }

    return createClient(supabaseUrl, supabaseAnonKey)
}

/**
 * 創建管理員 Supabase 客戶端（使用 service role key）
 * 用於需要繞過 RLS 的管理操作
 * 
 * @throws {Error} 如果 SUPABASE_SERVICE_ROLE_KEY 未設定
 */
export function createAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
        throw new Error(
            'SUPABASE_SERVICE_ROLE_KEY is not set. ' +
            'This is required for admin operations. ' +
            'Please set it in your environment variables.'
        )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
