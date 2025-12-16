import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // 從 order_items 獲取證書資訊
        const { data: orderItem, error } = await supabase
            .from('order_items')
            .select(`
        *,
        orders (
          id,
          created_at,
          temples (
            name,
            address,
            phone
          )
        ),
        lantern_products (
          name,
          description,
          category
        )
      `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching certificate:', error)
            return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
        }

        // 構建證書資料
        const certificate = {
            id: orderItem.id,
            orderId: orderItem.orders?.id,
            believerName: orderItem.believer_name,
            birthDate: orderItem.birth_date,
            birthTime: orderItem.birth_time,
            wishText: orderItem.wish_text,
            lanternType: orderItem.lantern_products?.name,
            lanternDescription: orderItem.lantern_products?.description,
            templeName: orderItem.orders?.temples?.name,
            templeAddress: orderItem.orders?.temples?.address,
            lightingDate: orderItem.orders?.created_at,
            certificateUrl: orderItem.certificate_url
        }

        return NextResponse.json(certificate)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
