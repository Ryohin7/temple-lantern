import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

/**
 * API 認證中間件
 * 驗證用戶登入狀態和角色權限
 */

export type UserRole = 'user' | 'temple_admin' | 'admin'

export interface AuthenticatedUser {
    id: string
    email: string
    role: UserRole
}

/**
 * 驗證用戶是否已登入
 * @returns 用戶資料或 null
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
    try {
        const supabase = createServerClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        // 從 users 表獲取角色資訊
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        return {
            id: user.id,
            email: user.email || '',
            role: (userData?.role as UserRole) || 'user'
        }
    } catch (error) {
        console.error('Error getting current user:', error)
        return null
    }
}

/**
 * 檢查用戶是否有指定角色或更高權限
 * @param user 用戶資料
 * @param requiredRole 需要的角色
 * @returns 是否有權限
 */
export function hasRole(user: AuthenticatedUser, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
        user: 1,
        temple_admin: 2,
        admin: 3
    }

    const userLevel = roleHierarchy[user.role]
    const requiredLevel = roleHierarchy[requiredRole]

    return userLevel >= requiredLevel
}

/**
 * API 路由認證包裝器
 * @param handler API 處理函數
 * @param options 選項
 * @returns 包裝後的處理函數
 */
export function withAuth(
    handler: (user: AuthenticatedUser, request: NextRequest) => Promise<NextResponse>,
    options?: {
        requiredRole?: UserRole
    }
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        // 1. 驗證用戶登入
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized', message: '請先登入' },
                { status: 401 }
            )
        }

        // 2. 驗證角色權限
        if (options?.requiredRole && !hasRole(user, options.requiredRole)) {
            return NextResponse.json(
                { error: 'Forbidden', message: '權限不足' },
                { status: 403 }
            )
        }

        // 3. 執行處理函數
        try {
            return await handler(user, request)
        } catch (error) {
            console.error('API handler error:', error)
            return NextResponse.json(
                { error: 'Internal Server Error', message: '伺服器錯誤' },
                { status: 500 }
            )
        }
    }
}
