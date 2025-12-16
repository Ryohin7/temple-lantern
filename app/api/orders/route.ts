import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 暫時返回所有訂單，實際部署時需要根據用戶 ID 過濾
        // 需要實作認證中間件
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || ''

        let query = supabase
            .from('orders')
            .select(`
        *,
        temples (
          name,
          slug
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
      `)
            .order('created_at', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }

        const { data: orders, error } = await query

        if (error) {
            console.error('Error fetching orders:', error)
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(orders || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}
