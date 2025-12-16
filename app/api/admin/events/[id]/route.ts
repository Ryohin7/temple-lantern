import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 獲取活動詳情
export const GET = withAuth(async (user, request) => {
    try {
        const supabase = createServerClient()
        // 從 request.url 解析 id (因為是 dynamic route，id 不會直接傳入 GET)
        const id = request.url.split('/').slice(-1)[0]

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        // 查詢活動
        const { data: event, error } = await supabase
            .from('events')
            .select(`
                *,
                temples (
                    id,
                    name,
                    slug
                )
            `)
            .eq('id', id)
            .single()

        if (error) {
            console.error('Failed to fetch event:', error)
            return NextResponse.json(
                { error: 'Failed to fetch event' },
                { status: 500 }
            )
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('Event API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'temple_admin' }) // 至少需要廟宇管理員權限

// 更新活動
export const PUT = withAuth(async (user, request) => {
    try {
        const supabase = createAdminClient()
        const id = request.url.split('/').slice(-1)[0]
        const body = await request.json()

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

        // 轉換前端駝峰命名為資料庫蛇形命名
        const updateData: any = {
            title: body.title,
            slug: body.slug,
            temple_id: body.templeId,
            date: body.date,
            time: body.time,
            description: body.description,
            price: body.price,
            original_price: body.originalPrice, // 假設資料庫有此欄位
            max_participants: body.maxParticipants,
            image: body.imageUrl,
            status: body.isActive ? 'upcoming' : 'cancelled', // 簡單對應狀態
            updated_at: new Date().toISOString()
        }

        // 過濾 undefined 值
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        )

        const { error } = await supabase
            .from('events')
            .update(updateData)
            .eq('id', id)

        if (error) {
            console.error('Failed to update event:', error)
            return NextResponse.json(
                { error: 'Failed to update event: ' + error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Event API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'temple_admin' })

// 刪除活動
export const DELETE = withAuth(async (user, request) => {
    try {
        const supabase = createAdminClient()
        const id = request.url.split('/').slice(-1)[0]

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
        }

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
        console.error('Event API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'temple_admin' })
