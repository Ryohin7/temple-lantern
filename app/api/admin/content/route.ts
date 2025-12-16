import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-auth'
import { createServerClient, createAdminClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 獲取內容頁面列表
export const GET = withAuth(async (user, request) => {
    try {
        const supabase = createServerClient()
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        let query = supabase
            .from('page_contents')
            .select('*')

        if (slug) {
            query = query.eq('page_key', slug).single()
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
            // 如果表不存在，返回空陣列而不是錯誤
            if (error.code === '42P01') {
                return NextResponse.json(slug ? { error: 'Table not found' } : [])
            }
            return NextResponse.json(slug ? { error: 'Failed to fetch page' } : [], { status: 500 })
        }

        // 轉換 page_key 為 slug 供前端使用
        const formatData = (item: any) => ({
            ...item,
            slug: item.page_key
        })

        const formattedData = Array.isArray(data)
            ? data.map(formatData)
            : data ? formatData(data) : (slug ? {} : []);

        return NextResponse.json(formattedData)
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

        if (!slug || !content) {
            return NextResponse.json(
                { error: 'Slug/PageKey and content are required' },
                { status: 400 }
            )
        }

        // 使用 upsert，以 page_key 為唯一鍵
        const { data, error } = await supabase
            .from('page_contents')
            .upsert({
                page_key: slug,
                title,
                content,
                // status // 資料庫中似乎沒有 status 欄位？ migration 中沒看到 status。
                // 如果 migration 沒有 status，我們不應該傳入 status
            }, { onConflict: 'page_key' })
            .select()
            .single()

        if (error) {
            console.error('Failed to save content:', error)
            return NextResponse.json(
                { error: `Failed to save content: ${error.message}` },
                { status: 500 }
            )
        }

        return NextResponse.json({
            ...data,
            slug: data.page_key
        })
    } catch (error) {
        console.error('Content API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}, { requiredRole: 'admin' })
