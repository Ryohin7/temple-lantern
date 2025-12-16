import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { data: order, error } = await supabase
            .from('orders')
            .select(`
        *,
        temples (
          name,
          slug,
          address,
          phone
        ),
        order_items (
          id,
          quantity,
          price,
          believer_name,
          birth_date,
          birth_time,
          wish_text,
          certificate_url,
          lantern_products (
            name,
            description,
            category,
            image
          )
        )
      `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching order:', error)
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
