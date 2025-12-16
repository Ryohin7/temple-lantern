import { createClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = createClient()

        // 查詢法會活動（需要先創建 events 表）
        // 目前返回空陣列，需要在資料庫中創建 events 表
        const { data: events, error } = await supabase
            .from('events')
            .select(`
        *,
        temples (
          name
        )
      `)
            .order('date', { ascending: true })

        if (error) {
            console.error('Error fetching events:', error)
            return NextResponse.json([], { status: 200 }) // 返回空陣列而非錯誤
        }

        return NextResponse.json(events || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}
