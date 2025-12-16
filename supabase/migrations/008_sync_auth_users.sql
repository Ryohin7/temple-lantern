-- ===================================
-- 簡化的用戶註冊解決方案
-- ===================================

-- 方案：不依賴 users 表，直接使用 Supabase Auth 的 user_metadata
-- 這樣可以避免 RLS 和 trigger 的複雜性

-- 1. 檢查 auth.users 表中是否有用戶
SELECT id, email, raw_user_meta_data FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- 2. 如果您仍然想使用 users 表，可以手動同步現有的 auth 用戶
-- 注意：這個操作會將所有 auth.users 中的用戶同步到 public.users
INSERT INTO public.users (id, email, name, role, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'name', ''),
    COALESCE(raw_user_meta_data->>'role', 'user'),
    created_at,
    updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- 3. 驗證同步結果
SELECT COUNT(*) as auth_users FROM auth.users;
SELECT COUNT(*) as public_users FROM public.users;

-- 如果兩個數字相同，表示同步成功
