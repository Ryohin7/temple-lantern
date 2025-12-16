-- =====================================================
-- Migration 015: Security Fixes
-- =====================================================
-- 目的：移除密碼明文儲存，提升安全性
-- 日期：2025-12-16
-- =====================================================

-- 1. 刪除 temple_applications 表的 admin_password_hash 欄位
-- 密碼已由 Supabase Auth 管理，不需要在此表儲存
ALTER TABLE public.temple_applications 
DROP COLUMN IF EXISTS admin_password_hash;

-- 2. 確保 user_id 欄位存在且有正確的外鍵約束
DO $$ 
BEGIN
    -- 檢查 user_id 欄位是否存在
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'temple_applications' 
        AND column_name = 'user_id'
    ) THEN
        -- 如果不存在，添加欄位
        ALTER TABLE public.temple_applications 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. 為 user_id 創建索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_temple_applications_user_id 
ON public.temple_applications(user_id);

-- 4. 註解說明
COMMENT ON TABLE public.temple_applications IS '廟宇申請表 - 密碼由 Supabase Auth 管理，不在此表儲存';
COMMENT ON COLUMN public.temple_applications.user_id IS '關聯到 auth.users 的用戶 ID';
