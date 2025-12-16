import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = createServerClient()

        // 檢查管理員權限
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()

        // 驗證必填欄位
        if (!body.title || !body.temple_id || !body.start_date || !body.end_date) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 創建活動
        const { data: event, error } = await supabase
            .from('events')
            .insert({
                title: body.title,
                description: body.description || '',
                temple_id: body.temple_id,
                start_date: body.start_date,
                end_date: body.end_date,
                location: body.location || '',
                max_participants: body.max_participants || null,
                price: body.price || 0,
                image_url: body.image_url || '',
                is_active: body.is_active !== undefined ? body.is_active : true,
            })
            .select()
            .single()

        if (error) {
            console.error('Failed to create event:', error)
            return NextResponse.json(
                { error: 'Failed to create event' },
                { status: 500 }
            )
        }

        return NextResponse.json(event)

    } catch (error) {
        console.error('Admin events API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = createServerClient()

        // 檢查管理員權限
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { id, ...updateData } = body

        if (!id) {
            return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
        }

        // 更新活動
        const { data: event, error } = await supabase
            .from('events')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Failed to update event:', error)
            return NextResponse.json(
                { error: 'Failed to update event' },
                { status: 500 }
            )
        }

        return NextResponse.json(event)

    } catch (error) {
        console.error('Admin events API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabase = createServerClient()

        // 檢查管理員權限
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
        }

        // 刪除活動
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Failed to delete event:', error)
            return NextResponse.json(
                { error: 'Failed to delete event' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Admin events API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
