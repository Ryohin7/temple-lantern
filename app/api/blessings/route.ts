import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)
        const templeId = searchParams.get('temple_id') || ''
        const limit = parseInt(searchParams.get('limit') || '50')

        let query = supabase
            .from('blessings')
            .select(`
        *,
        users (
          name
        ),
        temples (
          name
        )
      `)
            .eq('is_public', true)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (templeId) {
            query = query.eq('temple_id', templeId)
        }

        const { data: blessings, error } = await query

        if (error) {
            console.error('Error fetching blessings:', error)
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(blessings || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}

export async function POST(request: Request) {
    try {
        // Use admin client to bypass RLS
        const supabase = createAdminClient()
        const body = await request.json()

        const { data: blessing, error } = await supabase
            .from('blessings')
            .insert([body])
            .select()
            .single()

        if (error) {
            console.error('Error creating blessing:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(blessing)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
