import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const now = new Date().toISOString()

        const { data: promoItems, error } = await supabase
            .from('promo_items')
            .select(`
        *,
        temples (
          name,
          slug
        ),
        lantern_products (
          name,
          category
        ),
        events (
          slug
        )
      `)
            .eq('is_active', true)
            .lte('sale_start', now)
            .gte('sale_end', now)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching promo items:', error)
            return NextResponse.json([], { status: 200 })
        }

        // 轉換資料格式
        const formattedPromoItems = promoItems?.map((item: any) => ({
            id: item.id,
            type: item.type,
            name: item.name,
            description: item.description,
            temple: item.temples?.name || '',
            templeSlug: item.temples?.slug || '',
            originalPrice: item.original_price,
            salePrice: item.sale_price,
            stock: item.stock,
            sold: item.sold,
            saleEnd: item.sale_end,
            eventSlug: item.events?.slug || ''
        })) || []

        return NextResponse.json(formattedPromoItems)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}
