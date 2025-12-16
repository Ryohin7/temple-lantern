import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        // 使用 admin client 來繞過 RLS
        const supabase = createAdminClient()

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

        // 1. 立即創建 Auth 用戶（trigger 會自動創建 users 記錄）
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: body.adminEmail,
            password: body.password,
            email_confirm: true,
            user_metadata: {
                name: body.adminName,
                phone: body.adminPhone,
            }
        })

        if (authError) {
            console.error('Failed to create auth user:', authError)
            return NextResponse.json(
                { error: '創建用戶失敗：' + authError.message },
                { status: 500 }
            )
        }

        // 2. Trigger 已自動創建 users 記錄，等待一下讓它完成
        await new Promise(resolve => setTimeout(resolve, 1000))

        // 更新用戶資料
        const { error: userError } = await supabase
            .from('users')
            .update({
                name: body.adminName,
                phone: body.adminPhone,
            })
            .eq('id', authUser.user.id)

        if (userError) {
            console.error('Failed to update user record:', userError)
        }

        // 3. 創建申請記錄（不儲存密碼）
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
