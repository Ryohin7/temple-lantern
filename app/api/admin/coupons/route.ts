import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 獲取所有折扣碼
export const GET = withAuth(async (user) => {
    try {
        const supabase = createServerClient()

        // 查詢折扣碼
        let query = supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false })

        // 如果不是管理員，只能看到啟用的
        // (雖然此 API 主要是給管理後台用的，但加上此檢查更安全)
        // 注意：withAuth 的 requiredRole: 'admin' 選項如果被啟用，這裡就是多餘的
        // 但為了靈活性，可以在 API 內部處理

        const { data: coupons, error } = await query

        if (error) {
            console.error('Failed to fetch coupons:', error)
            return NextResponse.json([])
        }

        return NextResponse.json(coupons || [])
    } catch (error) {
        console.error('Coupons API error:', error)
        return NextResponse.json([])
    }
}, { requiredRole: 'admin' })

// 創建折扣碼
export const POST = withAuth(async (user, request) => {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const { error } = await supabase
            .from('coupons')
            .insert({
                ...body,
                start_date: body.startDate,
                end_date: body.endDate,
                min_order_amount: body.minOrderAmount,
                max_discount: body.maxDiscount,
                usage_limit: body.usageLimit,
                per_user_limit: body.perUserLimit,
                start_dateHTML: undefined, // 清理不必要的欄位
            })

        if (error) {
            console.error('Failed to create coupon:', error)
            return NextResponse.json(
                { error: 'Failed to create coupon: ' + error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Coupons API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'admin' })

// 更新折扣碼
export const PUT = withAuth(async (user, request) => {
    try {
        const supabase = createAdminClient()
        const body = await request.json()
        const { id, ...updates } = body

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        // 轉換欄位名稱以符合資料庫
        const dbUpdates = {
            ...updates,
            start_date: updates.startDate,
            end_date: updates.endDate,
            min_order_amount: updates.minOrderAmount,
            max_discount: updates.maxDiscount,
            usage_limit: updates.usageLimit,
            per_user_limit: updates.perUserLimit,
            is_active: updates.isActive,
        }

        // 移除轉換前的欄位
        delete dbUpdates.startDate
        delete dbUpdates.endDate
        delete dbUpdates.minOrderAmount
        delete dbUpdates.maxDiscount
        delete dbUpdates.usageLimit
        delete dbUpdates.perUserLimit
        delete dbUpdates.isActive

        const { error } = await supabase
            .from('coupons')
            .update(dbUpdates)
            .eq('id', id)

        if (error) {
            console.error('Failed to update coupon:', error)
            return NextResponse.json(
                { error: 'Failed to update coupon' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Coupons API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'admin' })

// 刪除折扣碼
export const DELETE = withAuth(async (user, request) => {
    try {
        const supabase = createAdminClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Failed to delete coupon:', error)
            return NextResponse.json(
                { error: 'Failed to delete coupon' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Coupons API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'admin' })
