import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
    try {
        // 使用 service role key 來繞過 RLS（僅用於此 API）
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

        // 簡單的密碼儲存（注意：生產環境應使用 bcrypt）
        const passwordHash = body.password

        // 創建申請記錄
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
                admin_password_hash: passwordHash,
                status: 'pending',
            })
            .select()
            .single()

        if (error) {
            console.error('Failed to create application:', error)
            return NextResponse.json(
                { error: '申請提交失敗', details: error.message },
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
