import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { page: string } }
) {
    try {
        const supabase = createServerClient()
        const { page } = params

        const { data: content, error } = await supabase
            .from('page_contents')
            .select('*')
            .eq('page_key', page)
            .single()

        if (error) {
            console.error('Failed to fetch page content:', error)
            return NextResponse.json(
                { error: 'Page not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(content)

    } catch (error) {
        console.error('Page content API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { page: string } }
) {
    try {
        const supabase = createServerClient()

        // 檢查管理員權限
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { page } = params
        const body = await request.json()

        const { data: content, error } = await supabase
            .from('page_contents')
            .update({
                title: body.title,
                content: body.content,
                meta_description: body.meta_description,
            })
            .eq('page_key', page)
            .select()
            .single()

        if (error) {
            console.error('Failed to update page content:', error)
            return NextResponse.json(
                { error: 'Failed to update content' },
                { status: 500 }
            )
        }

        return NextResponse.json(content)

    } catch (error) {
        console.error('Page content API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
