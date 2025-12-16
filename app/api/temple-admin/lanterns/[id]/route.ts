import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { data: lantern, error } = await supabase
            .from('lantern_products')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching lantern:', error)
            return NextResponse.json({ error: 'Lantern not found' }, { status: 404 })
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

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()

        const { data: lantern, error } = await supabase
            .from('lantern_products')
            .update(body)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating lantern:', error)
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

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const { error } = await supabase
            .from('lantern_products')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting lantern:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
