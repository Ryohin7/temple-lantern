import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 獲取當前用戶的通知
export const GET = withAuth(async (user) => {
    try {
        const supabase = createServerClient()

        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Failed to fetch notifications:', error)
            return NextResponse.json([])
        }

        return NextResponse.json(notifications || [])
    } catch (error) {
        console.error('Notifications API error:', error)
        return NextResponse.json([])
    }
})

// 標記通知為已讀
export const PUT = withAuth(async (user, request) => {
    try {
        const supabase = createServerClient()
        const body = await request.json()
        const { notificationId, isRead } = body

        if (!notificationId) {
            return NextResponse.json(
                { error: 'Missing notificationId' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: isRead !== false })
            .eq('id', notificationId)
            .eq('user_id', user.id)  // 確保只能更新自己的通知

        if (error) {
            console.error('Failed to update notification:', error)
            return NextResponse.json(
                { error: 'Failed to update notification' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Notifications API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
})

// 刪除通知
export const DELETE = withAuth(async (user, request) => {
    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)
        const notificationId = searchParams.get('id')

        if (!notificationId) {
            return NextResponse.json(
                { error: 'Missing notification ID' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', user.id)  // 確保只能刪除自己的通知

        if (error) {
            console.error('Failed to delete notification:', error)
            return NextResponse.json(
                { error: 'Failed to delete notification' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Notifications API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
})
