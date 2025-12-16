-- =====================================================
-- Migration 017: LINE Notification Integration
-- =====================================================
-- 目的：為廟宇添加 LINE 通知相關欄位
-- 日期：2025-12-16
-- =====================================================

-- 1. 在 temples 表添加 LINE 設定欄位
ALTER TABLE public.temples
ADD COLUMN IF NOT EXISTS line_channel_access_token TEXT,
ADD COLUMN IF NOT EXISTS line_channel_secret TEXT,
ADD COLUMN IF NOT EXISTS line_notify_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS line_rich_menu_id TEXT;

-- 2. 創建 notification_templates 表
-- 用於儲存 LINE 訊息模板
CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('order_confirmation', 'payment_reminder', 'lighting_completion', 'expiry_notification')),
    title TEXT NOT NULL,
    message_format TEXT NOT NULL, -- 支援變數如 {{user_name}}, {{order_id}}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(temple_id, type)
);

-- RLS 政策
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- 廟方管理員可以管理自己的模板
CREATE POLICY "Temple admins can manage their templates"
    ON public.notification_templates FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.temples
            WHERE temples.id = notification_templates.temple_id
            AND temples.owner_id = auth.uid()
        )
    );

-- 3. 註解
COMMENT ON COLUMN public.temples.line_channel_access_token IS 'LINE Messaging API Access Token';
COMMENT ON COLUMN public.temples.line_notify_enabled IS '是否啟用 LINE 通知';
