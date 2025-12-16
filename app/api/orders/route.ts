import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const GET = withAuth(async (user, request) => {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || ''

    // 只返回當前用戶的訂單
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
      .eq('user_id', user.id)  // 只返回當前用戶的訂單
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      )
    }

    return NextResponse.json(orders || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
