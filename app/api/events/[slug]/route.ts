import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const supabase = createClient()
        const { slug } = params

        const { data: event, error } = await supabase
            .from('events')
            .select(`
        *,
        temples (
          name,
          slug
        )
      `)
            .eq('slug', slug)
            .single()

        if (error) {
            console.error('Error fetching event:', error)
            return NextResponse.json({ error: 'Event not found' }, { status: 404 })
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
