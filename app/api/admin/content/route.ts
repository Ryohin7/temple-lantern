import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 獲取內容頁面列表
export const GET = withAuth(async (user) => {
    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        let query = supabase
            .from('page_contents')
            .select('*')

        if (slug) {
            query = query.eq('slug', slug).single()
        } else {
            query = query.order('updated_at', { ascending: false })
        }

        const { data, error } = await query

        if (error) {
            // 如果是查詢單個且未找到，返回 404
            if (slug && error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Page not found' }, { status: 404 })
            }
            console.error('Failed to fetch pages:', error)
            // 如果表不存在，返回空陣列而不是錯誤 (僅限列表查詢)
            if (error.code === '42P01') {
                return NextResponse.json(slug ? { error: 'Table not found' } : [])
            }
            return NextResponse.json(slug ? { error: 'Failed to fetch page' } : [], { status: 500 })
        }

        return NextResponse.json(data || (slug ? {} : []))

        return NextResponse.json(pages || [])
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json([])
    }
}, { requiredRole: 'admin' })

// 創建或更新頁面內容
export const POST = withAuth(async (user, request) => {
    try {
        const supabase = createAdminClient()
        const body = await request.json()

        const { slug, title, content, status } = body

        if (!slug || !title) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const { error } = await supabase
            .from('page_contents')
            .upsert({
                slug,
                title,
                content,
                status,
                updated_at: new Date().toISOString()
            }, { onConflict: 'slug' })

        if (error) {
            console.error('Failed to save page:', error)
            return NextResponse.json(
                { error: 'Failed to save page' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'admin' })
