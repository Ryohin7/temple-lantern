import { supabase } from './supabase'

export interface AuthUser {
    id: string
    email: string
    name?: string
    role: 'user' | 'temple_admin' | 'admin'
}

// 註冊新用戶
export async function signUp(email: string, password: string, name: string, role: 'user' | 'temple_admin' = 'user') {
    try {
        // 1. 創建 Supabase Auth 用戶，將資料存在 metadata 中
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role,
                }
            }
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('User creation failed')

        // 2. 嘗試在 users 表中創建用戶資料（可選）
        // 如果失敗也不影響註冊，因為資料已存在 auth.users 的 metadata 中
        try {
            const { error: userError } = await supabase
                .from('users')
                .upsert([
                    {
                        id: authData.user.id,
                        email,
                        name,
                        role,
                    }
                ], {
                    onConflict: 'id'
                })

            if (userError) {
                console.warn('Failed to create user record in public.users, but auth user created successfully:', userError)
            }
        } catch (err) {
            console.warn('Error creating user record, but auth user created successfully:', err)
        }

        return { user: authData.user, error: null }
    } catch (error: any) {
        return { user: null, error: error.message }
    }
}

// 登入
export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        // 獲取用戶資料
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single()

        if (userError) throw userError

        return { user: userData, error: null }
    } catch (error: any) {
        return { user: null, error: error.message }
    }
}

// 登出
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

// 獲取當前用戶
export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return null

        // 先嘗試從 users 表獲取
        const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        // 如果 users 表有資料，使用它
        if (userData && !error) {
            return userData as AuthUser
        }

        // 否則從 auth metadata 構建用戶資料
        return {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            role: user.user_metadata?.role || 'user',
        } as AuthUser
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

// 檢查用戶是否為廟宇管理員
export async function isTempleAdmin(): Promise<boolean> {
    const user = await getCurrentUser()
    return user?.role === 'temple_admin' || user?.role === 'admin'
}

// 重設密碼
export async function resetPassword(email: string) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) throw error
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

// 更新密碼
export async function updatePassword(newPassword: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) throw error
        return { error: null }
    } catch (error: any) {
        return { error: error.message }
    }
}

// Google OAuth 登入
export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })

        if (error) throw error
        return { data, error: null }
    } catch (error: any) {
        return { data: null, error: error.message }
    }
}
