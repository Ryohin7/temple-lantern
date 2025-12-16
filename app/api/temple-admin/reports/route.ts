import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const period = searchParams.get('period') || 'month' // month, year, all

        // 獲取訂單統計
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount, created_at, status, payment_status')
            .eq('payment_status', 'paid')

        if (ordersError) {
            console.error('Error fetching orders for reports:', ordersError)
            return NextResponse.json({ error: ordersError.message }, { status: 500 })
        }

        // 計算統計數據
        const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0
        const totalOrders = orders?.length || 0

        // 按月份分組
        const monthlyData = orders?.reduce((acc: any, order) => {
            const month = new Date(order.created_at).toISOString().slice(0, 7)
            if (!acc[month]) {
                acc[month] = { revenue: 0, orders: 0 }
            }
            acc[month].revenue += Number(order.total_amount)
            acc[month].orders += 1
            return acc
        }, {})

        // 獲取燈種銷售排行
        const { data: topLanterns, error: lanternsError } = await supabase
            .from('order_items')
            .select(`
        lantern_id,
        quantity,
        lantern_products (
          name,
          category
        )
      `)

        // 統計每種燈的銷售數量
        const lanternStats = topLanterns?.reduce((acc: any, item: any) => {
            const lanternName = item.lantern_products?.name || 'Unknown'
            if (!acc[lanternName]) {
                acc[lanternName] = 0
            }
            acc[lanternName] += item.quantity
            return acc
        }, {})

        const topLanternsArray = Object.entries(lanternStats || {})
            .map(([name, count]) => ({ name, count }))
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 10)

        const report = {
            totalRevenue,
            totalOrders,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            monthlyData: Object.entries(monthlyData || {}).map(([month, data]: [string, any]) => ({
                month,
                revenue: data.revenue,
                orders: data.orders
            })),
            topLanterns: topLanternsArray
        }

        return NextResponse.json(report)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
