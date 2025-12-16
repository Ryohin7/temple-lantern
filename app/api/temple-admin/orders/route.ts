import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 暫時返回所有訂單
        // 實際部署時需要根據廟宇管理員的 temple_id 過濾
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const offset = (page - 1) * limit

        let query = supabase
            .from('orders')
            .select(`
        *,
        users (
          name,
          email,
          phone
        ),
        order_items (
          id,
          quantity,
          price,
          believer_name,
          lantern_products (
            name,
            category
          )
        )
      `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (status) {
            query = query.eq('status', status)
        }

        const { data: orders, error, count } = await query

        if (error) {
            console.error('Error fetching temple admin orders:', error)
            return NextResponse.json({ orders: [], total: 0 }, { status: 200 })
        }

        return NextResponse.json({
            orders: orders || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
