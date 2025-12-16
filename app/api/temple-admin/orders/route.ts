import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // TODO: 實際部署時需要根據廟宇管理員的 temple_id 過濾訂單
        // 目前返回所有訂單供測試使用
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '100')
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
            // Return empty array for frontend compatibility
            return NextResponse.json([], { status: 200 })
        }

        // Return flat array of orders (frontend expects this format)
        return NextResponse.json(orders || [])
    } catch (error) {
        console.error('Unexpected error in temple-admin orders:', error)
        // Return empty array on error
        return NextResponse.json([], { status: 200 })
    }
}
