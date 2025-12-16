import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 獲取當前用戶
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 從 users 表獲取用戶資料
        const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()

        // 如果 users 表沒有資料，從 auth metadata 構建
        const profile = userData || {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || '',
            role: user.user_metadata?.role || 'user',
        }

        // 獲取訂單統計
        const { data: orders } = await supabase
            .from('orders')
            .select('id')
            .eq('user_id', user.id)

        // 獲取點燈統計
        const { data: lanterns } = await supabase
            .from('order_items')
            .select('id')
            .in('order_id', orders?.map(o => o.id) || [])

        return NextResponse.json({
            ...profile,
            totalOrders: orders?.length || 0,
            totalLanterns: lanterns?.length || 0,
            memberSince: userData?.created_at || user.created_at,
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // 更新 users 表
        const { data, error } = await supabase
            .from('users')
            .update({
                name: body.name,
                phone: body.phone,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
