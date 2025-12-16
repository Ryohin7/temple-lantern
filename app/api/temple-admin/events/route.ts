import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 暫時返回所有法會活動
        // 實際部署時需要根據廟宇管理員的 temple_id 過濾
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: false })

        if (error) {
            console.error('Error fetching temple admin events:', error)
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(events || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const { data: event, error } = await supabase
            .from('events')
            .insert([body])
            .select()
            .single()

        if (error) {
            console.error('Error creating event:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(event)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
