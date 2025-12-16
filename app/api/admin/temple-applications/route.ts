import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = createClient()

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
        const supabase = createClient()

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

        const body = await request.json()
        const { applicationId, status, rejectionReason } = body

        if (!applicationId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 更新申請狀態
        const updateData: any = {
            status,
            reviewed_by: user.id,
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
        if (status === 'approved') {
            // TODO: 實作創建廟宇和管理員帳號的邏輯
            // 1. 創建 auth user
            // 2. 創建 users 記錄 (role = 'temple_admin')
            // 3. 創建 temples 記錄
            // 4. 發送通知 email
        }

        return NextResponse.json({ success: true, application })

    } catch (error) {
        console.error('Admin temple applications API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
