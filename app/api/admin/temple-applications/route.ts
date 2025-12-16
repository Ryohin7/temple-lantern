import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    try {
        // 使用 service role key 來繞過 RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // 獲取所有申請
        const { data: applications, error } = await supabase
            .from('temple_applications')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Failed to fetch applications:', error)
            return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
        }

        return NextResponse.json(applications)

    } catch (error) {
        console.error('Admin temple applications API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        // 使用 service role key 來繞過 RLS
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        const body = await request.json()
        const { applicationId, status, rejectionReason } = body

        if (!applicationId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 獲取申請資料
        const { data: application, error: fetchError } = await supabase
            .from('temple_applications')
            .select('*')
            .eq('id', applicationId)
            .single()

        if (fetchError || !application) {
            return NextResponse.json({ error: '找不到申請記錄' }, { status: 404 })
        }

        // 更新申請狀態
        const updateData: any = {
            status,
            reviewed_at: new Date().toISOString(),
        }

        if (status === 'rejected' && rejectionReason) {
            updateData.rejection_reason = rejectionReason
        }

        const { error } = await supabase
            .from('temple_applications')
            .update(updateData)
            .eq('id', applicationId)

        if (error) {
            console.error('Failed to update application:', error)
            return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }

        // 如果批准，更新用戶角色並創建廟宇
        if (status === 'approved' && application.user_id) {
            try {
                // 1. 更新用戶角色為 temple_admin
                const { error: roleError } = await supabase
                    .from('users')
                    .update({ role: 'temple_admin' })
                    .eq('id', application.user_id)

                if (roleError) {
                    console.error('Failed to update user role:', roleError)
                    return NextResponse.json({ error: '更新用戶角色失敗' }, { status: 500 })
                }

                // 2. 創建 temples 記錄
                const templeSlug = application.temple_name
                    .toLowerCase()
                    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
                    .replace(/^-+|-+$/g, '')

                const { error: templeError } = await supabase
                    .from('temples')
                    .insert({
                        name: application.temple_name,
                        slug: templeSlug,
                        address: application.address,
                        phone: application.phone,
                        email: application.email,
                        main_god: application.main_god,
                        description: application.description || '',
                        owner_id: application.user_id,
                        status: 'active',
                        theme_color: '#DC2626',
                    })

                if (templeError) {
                    console.error('Failed to create temple:', templeError)
                    return NextResponse.json({ error: '創建廟宇記錄失敗' }, { status: 500 })
                }

                console.log('Successfully approved temple application:', {
                    userId: application.user_id,
                    email: application.admin_email,
                })

                // TODO: 發送批准通知 email
            } catch (approvalError) {
                console.error('Error during approval:', approvalError)
                return NextResponse.json({ error: '批准過程發生錯誤' }, { status: 500 })
            }
        }

        return NextResponse.json({ success: true, application })

    } catch (error) {
        console.error('Admin temple applications API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH 方法作為 PUT 的別名
export async function PATCH(request: NextRequest) {
    return PUT(request)
}
