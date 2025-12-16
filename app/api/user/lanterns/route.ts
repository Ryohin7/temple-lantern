import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 獲取用戶的燈種
export const GET = withAuth(async (user) => {
    try {
        const supabase = createServerClient()

        // 查詢用戶的訂單和燈種
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                id,
                created_at,
                temples (
                    name,
                    slug
                ),
                order_items (
                    id,
                    believer_name,
                    birth_date,
                    birth_time,
                    wish_text,
                    certificate_url,
                    created_at,
                    lantern_products (
                        name,
                        category,
                        duration_months
                    )
                )
            `)
            .eq('user_id', user.id)
            .eq('payment_status', 'paid')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Failed to fetch user lanterns:', error)
            return NextResponse.json([])
        }

        // 轉換為燈種格式並計算到期狀態
        const lanterns = orders?.flatMap(order =>
            order.order_items?.map((item: any) => {
                const lightingDate = new Date(item.created_at)
                const durationMonths = item.lantern_products?.duration_months || 12
                const expiryDate = new Date(lightingDate)
                expiryDate.setMonth(expiryDate.getMonth() + durationMonths)

                const now = new Date()
                const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                let status: 'active' | 'expiring_soon' | 'expired'
                if (daysLeft <= 0) {
                    status = 'expired'
                } else if (daysLeft <= 30) {
                    status = 'expiring_soon'
                } else {
                    status = 'active'
                }

                return {
                    id: item.id,
                    orderId: order.id,
                    userId: user.id,
                    temple: order.temples?.name || '未知廟宇',
                    templeSlug: order.temples?.slug || '',
                    name: item.lantern_products?.name || '未知燈種',
                    category: item.lantern_products?.category || 'general',
                    believerName: item.believer_name,
                    birthDate: item.birth_date,
                    birthTime: item.birth_time,
                    wishText: item.wish_text,
                    lightingDate: lightingDate.toISOString(),
                    expiryDate: expiryDate.toISOString(),
                    daysLeft,
                    status,
                    certificateUrl: item.certificate_url
                }
            }) || []
        ) || []

        return NextResponse.json(lanterns)
    } catch (error) {
        console.error('User lanterns API error:', error)
        return NextResponse.json([])
    }
})
