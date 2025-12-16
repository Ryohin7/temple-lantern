import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params

        const { data: temple, error } = await supabase
            .from('temples')
            .select(`
        *,
        lantern_products (
          id,
          name,
          description,
          benefits,
          price,
          duration_months,
          stock,
          image,
          category,
          is_active
        )
      `)
            .eq('slug', slug)
            .eq('status', 'active')
            .single()

        if (error) {
            console.error('Error fetching temple:', error)
            return NextResponse.json({ error: 'Temple not found' }, { status: 404 })
        }

        return NextResponse.json(temple)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
