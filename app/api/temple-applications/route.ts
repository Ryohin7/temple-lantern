import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
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

        // 驗證必填欄位
        const required = ['templeName', 'address', 'phone', 'email', 'mainGod', 'adminName', 'adminEmail', 'adminPhone', 'password']
        for (const field of required) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        // 檢查 email 是否已被使用
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', body.adminEmail)
            .single()

        if (existingUser) {
            return NextResponse.json(
                { error: '此 Email 已被使用' },
                { status: 400 }
            )
        }

        // 1. 立即創建 Auth 用戶
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: body.adminEmail,
            password: body.password,
            email_confirm: true,
        })

        if (authError) {
            console.error('Failed to create auth user:', authError)
            return NextResponse.json(
                { error: '創建用戶失敗：' + authError.message },
                { status: 500 }
            )
        }

        // 2. 創建 users 記錄（role = 'user'，等批准後再改為 temple_admin）
        const { error: userError } = await supabase
            .from('users')
            .insert({
                id: authUser.user.id,
                email: body.adminEmail,
                name: body.adminName,
                phone: body.adminPhone,
                role: 'user', // 先設為 user，批准後改為 temple_admin
            })

        if (userError) {
            console.error('Failed to create user record:', userError)
            // 如果創建失敗，刪除 Auth 用戶
            await supabase.auth.admin.deleteUser(authUser.user.id)
            return NextResponse.json(
                { error: '創建用戶記錄失敗：' + userError.message },
                { status: 500 }
            )
        }

        // 3. 創建申請記錄
        const { data: application, error } = await supabase
            .from('temple_applications')
            .insert({
                temple_name: body.templeName,
                address: body.address,
                phone: body.phone,
                email: body.email,
                main_god: body.mainGod,
                description: body.description || '',
                admin_name: body.adminName,
                admin_email: body.adminEmail,
                admin_phone: body.adminPhone,
                admin_password_hash: body.password, // 保留以備需要
                user_id: authUser.user.id, // 關聯到創建的用戶
                status: 'pending',
            })
            .select()
            .single()

        if (error) {
            console.error('Failed to create application:', error)
            // 如果創建申請失敗，刪除用戶
            await supabase.from('users').delete().eq('id', authUser.user.id)
            await supabase.auth.admin.deleteUser(authUser.user.id)
            return NextResponse.json(
                { error: '申請提交失敗：' + error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: '申請已送出！我們將在 1-3 個工作天內審核您的申請，並以 Email 通知您。',
            applicationId: application.id,
        })

    } catch (error) {
        console.error('Temple application API error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
