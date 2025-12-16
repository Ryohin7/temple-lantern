import { createServerClient, createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    let query = supabase
      .from('banners')
      .select(`
        id,
        title,
        subtitle,
        image,
        link,
        bg_color,
        is_active,
        start_date,
        end_date,
        temple_id,
        temples (
          name
        )
      `)

    if (!all) {
      // Public API - only show active banners within date range
      const now = new Date().toISOString()
      query = query
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
    }

    query = query.order('display_order', { ascending: true })

    const { data: banners, error } = await query

    if (error) {
      console.error('Error fetching banners:', error)
      return NextResponse.json([])
    }

    // 轉換資料格式以符合前端需求
    const formattedBanners = banners?.map((banner: any) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image || '',
      link: banner.link,
      temple_name: banner.temples?.name || '',
      bg_color: banner.bg_color,
      active: banner.is_active,
      start_date: banner.start_date,
      end_date: banner.end_date,
    })) || []

    return NextResponse.json(formattedBanners)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use admin client to bypass RLS
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('banners')
      .insert([{
        title: body.title,
        subtitle: body.subtitle,
        link: body.link,
        bg_color: body.bgColor || body.bg_color,
        start_date: body.startDate || body.start_date,
        end_date: body.endDate || body.end_date,
        is_active: true,
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating banner:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
