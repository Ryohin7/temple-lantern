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

        // 檢查是否為管理員
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // 獲取所有設定
        const { data: settings, error } = await supabase
            .from('system_settings')
            .select('key, value')

        if (error) {
            console.error('Failed to fetch settings:', error)
            return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
        }

        // 將設定轉換為扁平結構
        const settingsMap: any = {}
        settings?.forEach(setting => {
            Object.assign(settingsMap, setting.value)
        })

        return NextResponse.json(settingsMap)

    } catch (error) {
        console.error('Settings API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
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

        // 檢查是否為管理員
        const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (userData?.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()

        // 更新各個設定類別
        const updates = [
            {
                key: 'site_info',
                value: {
                    siteName: body.siteName,
                    siteDescription: body.siteDescription,
                    contactEmail: body.contactEmail,
                    contactPhone: body.contactPhone,
                }
            },
            {
                key: 'payment_settings',
                value: {
                    platformFeeRate: body.platformFeeRate,
                    minOrderAmount: body.minOrderAmount,
                    maxOrderAmount: body.maxOrderAmount,
                    ecpayMerchantId: body.ecpayMerchantId || '',
                    ecpayHashKey: body.ecpayHashKey || '',
                    ecpayHashIV: body.ecpayHashIV || '',
                }
            },
            {
                key: 'member_settings',
                value: {
                    enableRegistration: body.enableRegistration,
                    enableGoogleLogin: body.enableGoogleLogin,
                }
            },
            {
                key: 'notification_settings',
                value: {
                    enableEmailNotification: body.enableEmailNotification,
                    enableSMSNotification: body.enableSMSNotification,
                }
            },
            {
                key: 'system_settings',
                value: {
                    maintenanceMode: body.maintenanceMode,
                }
            },
        ]

        // 批次更新所有設定
        for (const update of updates) {
            const { error } = await supabase
                .from('system_settings')
                .update({ value: update.value })
                .eq('key', update.key)

            if (error) {
                console.error(`Failed to update ${update.key}:`, error)
                return NextResponse.json(
                    { error: `Failed to update ${update.key}` },
                    { status: 500 }
                )
            }
        }

        return NextResponse.json({ success: true, message: 'Settings updated successfully' })

    } catch (error) {
        console.error('Settings API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
