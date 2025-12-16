import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 暫時返回所有燈種
        // 實際部署時需要根據廟宇管理員的 temple_id 過濾
        const { data: lanterns, error } = await supabase
            .from('lantern_products')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching lanterns:', error)
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(lanterns || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        const { data: lantern, error } = await supabase
            .from('lantern_products')
            .insert([body])
            .select()
            .single()

        if (error) {
            console.error('Error creating lantern:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(lantern)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
