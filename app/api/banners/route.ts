import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date().toISOString()

    // 查詢有效的廣告橫幅
    const { data: banners, error } = await supabase
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
        temples (
          name
        )
      `)
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching banners:', error)
      // 如果表不存在或其他錯誤，返回空陣列而不是 500 錯誤
      return NextResponse.json([])
    }

    // 轉換資料格式以符合前端需求
    const formattedBanners = banners?.map((banner: any) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image || '',
      link: banner.link,
      templeName: banner.temples?.[0]?.name || '台灣點燈網',
      bgColor: banner.bg_color,
      active: banner.is_active,
      startDate: banner.start_date,
      endDate: banner.end_date,
    })) || []

    return NextResponse.json(formattedBanners)
  } catch (error) {
    console.error('Unexpected error:', error)
    // 返回空陣列而不是錯誤，讓前端優雅地處理
    return NextResponse.json([])
  }
}
