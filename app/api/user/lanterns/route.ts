import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 暫時返回空陣列
        // 實際部署時需要根據用戶 ID 查詢
        // 需要 JOIN orders 和 order_items 表來獲取用戶的點燈記錄

        const { data: lanterns, error } = await supabase
            .from('order_items')
            .select(`
        id,
        believer_name,
        created_at,
        certificate_url,
        orders (
          id,
          created_at,
          temples (
            name,
            slug
          )
        ),
        lantern_products (
          name,
          category,
          duration_months
        )
      `)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Error fetching user lanterns:', error)
            return NextResponse.json([], { status: 200 })
        }

        // 轉換資料格式
        const formattedLanterns = lanterns?.map((item: any) => ({
            id: item.id,
            orderId: item.orders?.id || '',
            believerName: item.believer_name,
            templeName: item.orders?.temples?.name || '',
            templeSlug: item.orders?.temples?.slug || '',
            lanternType: item.lantern_products?.name || '',
            lightingDate: item.created_at,
            expiryDate: calculateExpiryDate(item.created_at, item.lantern_products?.duration_months || 12),
            status: 'active',
            certificateUrl: item.certificate_url
        })) || []

        return NextResponse.json(formattedLanterns)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}

function calculateExpiryDate(startDate: string, durationMonths: number): string {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + durationMonths)
    return date.toISOString()
}
