import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { withAuth } from '@/lib/api-auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - 獲取折扣碼詳情
export const GET = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createServerClient()
        const { id } = params

        const { data: coupon, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
            }
            console.error('Error fetching coupon:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(coupon)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'admin' })

// PUT - 更新折扣碼
export const PUT = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createAdminClient()
        const { id } = params
        const body = await request.json()

        const { data, error } = await supabase
            .from('coupons')
            .update({
                code: body.code,
                discount_type: body.discount_type || body.discountType,
                discount_value: body.discount_value || body.discountValue,
                start_date: body.start_date || body.startDate,
                end_date: body.end_date || body.endDate,
                min_order_amount: body.min_order_amount || body.minOrderAmount,
                max_discount: body.max_discount || body.maxDiscount,
                usage_limit: body.usage_limit || body.usageLimit,
                per_user_limit: body.per_user_limit || body.perUserLimit,
                is_active: body.is_active !== undefined ? body.is_active : body.isActive,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating coupon:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'admin' })

// DELETE - 刪除折扣碼
export const DELETE = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createAdminClient()
        const { id } = params

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting coupon:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Coupon deleted successfully' })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'admin' })
