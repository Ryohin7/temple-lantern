import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const GET = withAuth(async (user, request) => {
    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '100')
        const offset = (page - 1) * limit

        // 獲取廟方管理員所屬的廟宇
        const { data: temples } = await supabase
            .from('temples')
            .select('id')
            .eq('owner_id', user.id)

        if (!temples || temples.length === 0) {
            return NextResponse.json([])
        }

        const templeIds = temples.map(t => t.id)

        // 只返回該廟宇的訂單
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                users (
                    name,
                    email
                ),
                order_items (
                    id,
                    quantity,
                    price,
                    believer_name,
                    birth_date,
                    wish_text,
                    lantern_products (
                        name,
                        category
                    )
                )
            `)
            .in('temple_id', templeIds)  // 只返回該廟宇的訂單
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            console.error('Failed to fetch orders:', error)
            return NextResponse.json([])
        }

        return NextResponse.json(orders || [])
    } catch (error) {
        console.error('Temple admin orders API error:', error)
        return NextResponse.json([])
    }
}, { requiredRole: 'temple_admin' })  // 需要廟方管理員權限
