import { withAuth } from '@/lib/api-auth'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export const GET = withAuth(async (user) => {
    try {
        const supabase = createServerClient()

        // Find user's temple
        const { data: temple } = await supabase
            .from('temples')
            .select('id')
            .eq('owner_id', user.id)
            .single()

        if (!temple) {
            return NextResponse.json([], { status: 200 })
        }

        const { data: lanterns, error } = await supabase
            .from('lantern_products')
            .select('*')
            .eq('temple_id', temple.id) // Filter by temple
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
}, { requiredRole: 'temple_admin' })

export const POST = withAuth(async (user, request) => {
    try {
        const supabase = createServerClient()
        const body = await request.json()

        // Find user's temple
        const { data: temple } = await supabase
            .from('temples')
            .select('id')
            .eq('owner_id', user.id)
            .single()

        if (!temple) {
            return NextResponse.json({ error: 'No temple found for this user' }, { status: 400 })
        }

        const { data: lantern, error } = await supabase
            .from('lantern_products')
            .insert([{
                ...body,
                temple_id: temple.id
            }])
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
}, { requiredRole: 'temple_admin' })
