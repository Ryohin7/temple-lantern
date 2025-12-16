import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const supabase = createClient()

        // 獲取當前用戶
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 查詢用戶的通知
        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) {
            console.error('Error fetching notifications:', error)
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(notifications || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}
