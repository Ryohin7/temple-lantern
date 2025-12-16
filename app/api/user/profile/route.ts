import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        // 暫時返回模擬用戶資料
        // 實際部署時需要從認證 session 獲取用戶 ID
        const mockUser = {
            id: '1',
            name: '訪客用戶',
            email: 'guest@example.com',
            phone: '',
            avatar: '👤',
            memberSince: '2024-01-01',
            totalOrders: 0,
            totalLanterns: 0
        }

        return NextResponse.json(mockUser)
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()

        // 暫時返回成功
        // 實際部署時需要更新資料庫
        return NextResponse.json({ success: true, data: body })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
