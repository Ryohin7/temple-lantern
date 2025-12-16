import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()

        // 檢查管理員權限
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 檢查是否為管理員
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // 獲取日期範圍參數
        const searchParams = request.nextUrl.searchParams
        const range = searchParams.get('range') || 'month'

        // 計算日期範圍
        const now = new Date()
        let startDate = new Date()

        switch (range) {
            case 'week':
                startDate.setDate(now.getDate() - 7)
                break
            case 'month':
                startDate.setMonth(now.getMonth() - 1)
                break
            case 'quarter':
                startDate.setMonth(now.getMonth() - 3)
                break
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1)
                break
        }

        // 獲取總營收
        const { data: totalRevenueData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('payment_status', 'paid')

        const totalRevenue = totalRevenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

        // 獲取期間內營收
        const { data: periodRevenueData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('payment_status', 'paid')
            .gte('created_at', startDate.toISOString())

        const periodRevenue = periodRevenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

        // 平台抽成比例（從設定中獲取，預設 5%）
        const feeRate = 5
        const platformFee = Math.round(totalRevenue * (feeRate / 100))
        const periodPlatformFee = Math.round(periodRevenue * (feeRate / 100))

        // 獲取月度趨勢（最近6個月）
        const monthlyTrend = []
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date()
            monthStart.setMonth(now.getMonth() - i)
            monthStart.setDate(1)
            monthStart.setHours(0, 0, 0, 0)

            const monthEnd = new Date(monthStart)
            monthEnd.setMonth(monthEnd.getMonth() + 1)

            const { data: monthData } = await supabase
                .from('orders')
                .select('total_amount')
                .eq('payment_status', 'paid')
                .gte('created_at', monthStart.toISOString())
                .lt('created_at', monthEnd.toISOString())

            const revenue = monthData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
            const fee = Math.round(revenue * (feeRate / 100))

            monthlyTrend.push({
                month: `${monthStart.getMonth() + 1}月`,
                revenue,
                fee,
            })
        }

        // 獲取廟宇收入排行（前5名）
        const { data: templeStats } = await supabase
            .from('orders')
            .select(`
        temple_id,
        total_amount,
        temples (
          name
        )
      `)
            .eq('payment_status', 'paid')

        // 按廟宇分組統計
        const templeRevenue = new Map()
        templeStats?.forEach((order: any) => {
            const templeId = order.temple_id
            const templeName = order.temples?.name || '未知廟宇'
            const amount = order.total_amount || 0

            if (templeRevenue.has(templeId)) {
                const existing = templeRevenue.get(templeId)
                existing.revenue += amount
                existing.orders += 1
            } else {
                templeRevenue.set(templeId, {
                    name: templeName,
                    revenue: amount,
                    orders: 1,
                })
            }
        })

        // 轉換為陣列並排序
        const templeRanking = Array.from(templeRevenue.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((temple, index) => ({
                rank: index + 1,
                name: temple.name,
                revenue: temple.revenue,
                orders: temple.orders,
            }))

        // 付款方式統計（模擬數據，實際需要從訂單中獲取）
        const paymentMethods = {
            creditCard: { percentage: 65, amount: Math.round(totalRevenue * 0.65) },
            atm: { percentage: 25, amount: Math.round(totalRevenue * 0.25) },
            convenience: { percentage: 10, amount: Math.round(totalRevenue * 0.10) },
        }

        return NextResponse.json({
            stats: {
                totalRevenue,
                periodRevenue,
                platformFee,
                periodPlatformFee,
                pendingSettlement: 0, // 待實作結算邏輯
                settledAmount: platformFee, // 暫時等於總抽成
                feeRate,
            },
            monthlyTrend,
            templeRanking,
            paymentMethods,
        })

    } catch (error) {
        console.error('Finance API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
