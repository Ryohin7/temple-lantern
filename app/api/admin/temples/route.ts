import { withAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const GET = withAuth(async (user, request) => {
    const supabase = createServerClient()
    const { data: temples, error } = await supabase
        .from('temples')
        .select('id, name, slug, status')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(temples)
}, { requiredRole: 'admin' })
