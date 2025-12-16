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

        // 更新申請狀態
        const updateData: any = {
            status,
            reviewed_at: new Date().toISOString(),
        }

        if (status === 'rejected' && rejectionReason) {
            updateData.rejection_reason = rejectionReason
        }

        const { data: application, error } = await supabase
            .from('temple_applications')
            .update(updateData)
            .eq('id', applicationId)
            .select()
            .single()

        if (error) {
            console.error('Failed to update application:', error)
            return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }

        // 如果批准，創建廟宇和管理員帳號
        if (status === 'approved' && application) {
            try {
                // 1. 創建 Supabase Auth 用戶
                const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                    email: application.admin_email,
                    password: application.admin_password_hash,
                    email_confirm: true,
                })

                if (authError) {
                    console.error('Failed to create auth user:', authError)
                    return NextResponse.json({ error: '創建用戶帳號失敗', details: authError.message }, { status: 500 })
                }

                // 2. 創建 users 記錄
                const { error: userError } = await supabase
                    .from('users')
                    .insert({
                        id: authUser.user.id,
                        email: application.admin_email,
                        name: application.admin_name,
                        phone: application.admin_phone,
                        role: 'temple_admin',
                    })

                if (userError) {
                    console.error('Failed to create user record:', userError)
                    await supabase.auth.admin.deleteUser(authUser.user.id)
                    return NextResponse.json({ error: '創建用戶記錄失敗', details: userError.message }, { status: 500 })
                }

                // 3. 創建 temples 記錄
                const templeSlug = application.temple_name.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '')
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
                        owner_id: authUser.user.id,
                        status: 'active',
                        theme_color: '#DC2626',
                    })

                if (templeError) {
                    console.error('Failed to create temple:', templeError)
                    await supabase.from('users').delete().eq('id', authUser.user.id)
                    await supabase.auth.admin.deleteUser(authUser.user.id)
                    return NextResponse.json({ error: '創建廟宇記錄失敗', details: templeError.message }, { status: 500 })
                }

                console.log('Successfully created temple account:', { userId: authUser.user.id, email: application.admin_email })
            } catch (createError) {
                console.error('Error during account creation:', createError)
                return NextResponse.json({ error: '創建帳號過程發生錯誤' }, { status: 500 })
            }
        }

        return NextResponse.json({ success: true, application })

    } catch (error) {
        console.error('Admin temple applications API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH 方法作為 PUT 的別名（某些配置可能需要）
export async function PATCH(request: NextRequest) {
    return PUT(request)
}

