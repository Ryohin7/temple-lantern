import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { withAuth } from '@/lib/api-auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - 獲取廣告詳情
export const GET = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createServerClient()
        const { id } = params

        const { data: banner, error } = await supabase
            .from('banners')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Banner not found' }, { status: 404 })
            }
            console.error('Error fetching banner:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(banner)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'admin' })

// PUT - 更新廣告
export const PUT = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createAdminClient()
        const { id } = params
        const body = await request.json()

        const { data, error } = await supabase
            .from('banners')
            .update({
                title: body.title,
                subtitle: body.subtitle,
                link: body.link,
                image: body.image,
                bg_color: body.bg_color || body.bgColor,
                start_date: body.start_date || body.startDate,
                end_date: body.end_date || body.endDate,
                temple_id: body.temple_id || body.templeId,
                is_active: body.is_active !== undefined ? body.is_active : body.active,
                display_order: body.display_order || body.displayOrder || 0,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating banner:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'admin' })

// DELETE - 刪除廣告
export const DELETE = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createAdminClient()
        const { id } = params

        const { error } = await supabase
            .from('banners')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting banner:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: 'Banner deleted successfully' })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'admin' })

// PATCH - 切換廣告啟用狀態
export const PATCH = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createAdminClient()
        const { id } = params
        const body = await request.json()

        const { data, error } = await supabase
            .from('banners')
            .update({
                is_active: body.is_active !== undefined ? body.is_active : body.active,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error toggling banner status:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'admin' })
