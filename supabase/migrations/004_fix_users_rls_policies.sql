-- 修復 users 表的 RLS 政策（解決無限遞迴問題）

-- 首先，刪除所有現有政策
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- 確保 RLS 已啟用
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 1. 允許用戶查看自己的資料
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- 2. 允許用戶更新自己的資料
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 3. 允許在註冊時插入用戶資料
-- 使用 SECURITY DEFINER 的 trigger function 來處理插入，不需要這個政策
-- 但為了安全起見，仍然保留這個政策
CREATE POLICY "Enable insert for authentication" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 注意：移除了 "Admins can view all users" 政策以避免無限遞迴
-- 管理員功能應該使用 service role key 或 SECURITY DEFINER 函數來實現
