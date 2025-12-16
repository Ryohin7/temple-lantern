import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { withAuth } from '@/lib/api-auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET - 獲取法會詳情
export const GET = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createServerClient()
        const { id } = params

        // 獲取用戶的廟宇 ID
        const { data: temple } = await supabase
            .from('temples')
            .select('id')
            .eq('owner_id', user.id)
            .single()

        if (!temple) {
            return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
        }

        // 獲取法會詳情（確保是自己廟宇的）
        const { data: event, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .eq('temple_id', temple.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Event not found' }, { status: 404 })
            }
            console.error('Error fetching event:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'temple_admin' })

// PUT - 更新法會
export const PUT = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createAdminClient()
        const { id } = params
        const body = await request.json()

        // 獲取用戶的廟宇 ID
        const { data: temple } = await supabase
            .from('temples')
            .select('id')
            .eq('owner_id', user.id)
            .single()

        if (!temple) {
            return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
        }

        // 確認法會屬於該廟宇
        const { data: existing } = await supabase
            .from('events')
            .select('id')
            .eq('id', id)
            .eq('temple_id', temple.id)
            .single()

        if (!existing) {
            return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 })
        }

        // 更新法會
        const { data, error } = await supabase
            .from('events')
            .update({
                title: body.title,
                description: body.description,
                event_date: body.event_date,
                event_time: body.event_time,
                location: body.location,
                max_participants: body.max_participants,
                registration_deadline: body.registration_deadline,
                price: body.price,
                image: body.image,
                is_active: body.is_active !== undefined ? body.is_active : true,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('temple_id', temple.id)
            .select()
            .single()

        if (error) {
            console.error('Error updating event:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'temple_admin' })

// DELETE - 刪除法會
export const DELETE = withAuth(async (user, request, { params }) => {
    try {
        const supabase = createAdminClient()
        const { id } = params

        // 獲取用戶的廟宇 ID
        const { data: temple } = await supabase
            .from('temples')
            .select('id')
            .eq('owner_id', user.id)
            .single()

        if (!temple) {
            return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
        }

        // 檢查是否有報名記錄
        const { data: registrations } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', id)
            .limit(1)

        if (registrations && registrations.length > 0) {
            // 如果有報名，執行軟刪除
            const { error } = await supabase
                .from('events')
                .update({ is_active: false, updated_at: new Date().toISOString() })
                .eq('id', id)
                .eq('temple_id', temple.id)

            if (error) {
                console.error('Error soft deleting event:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ message: 'Event deactivated successfully' })
        } else {
            // 沒有報名，可以硬刪除
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id)
                .eq('temple_id', temple.id)

            if (error) {
                console.error('Error deleting event:', error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({ message: 'Event deleted successfully' })
        }
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}, { requiredRole: 'temple_admin' })
