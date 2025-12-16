import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const category = searchParams.get('category') || ''

        let query = supabase
            .from('temples')
            .select('*')
            .eq('status', 'active')
            .order('name', { ascending: true })

        // 搜尋過濾
        if (search) {
            query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,main_god.ilike.%${search}%`)
        }

        const { data: temples, error } = await query

        if (error) {
            console.error('Error fetching temples:', error)
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(temples || [])
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json([], { status: 200 })
    }
}
