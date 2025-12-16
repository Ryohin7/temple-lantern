import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 暫時返回模擬統計數據
        // 實際部署時需要根據廟宇管理員的 temple_id 查詢

        // 獲取今日訂單數
        const today = new Date().toISOString().split('T')[0]
        const { count: todayOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today)

        // 獲取總訂單數
        const { count: totalOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })

        // 獲取總收入
        const { data: revenueData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('payment_status', 'paid')

        const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

        // 獲取活躍燈種數
        const { count: activeLanterns } = await supabase
            .from('lantern_products')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)

        const stats = {
            todayOrders: todayOrders || 0,
            totalOrders: totalOrders || 0,
            totalRevenue: totalRevenue,
            activeLanterns: activeLanterns || 0,
            pendingOrders: 0, // 需要額外查詢
            completedOrders: 0, // 需要額外查詢
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
