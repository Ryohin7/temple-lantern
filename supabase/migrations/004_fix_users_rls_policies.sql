-- 修復 users 表的 RLS 政策以允許註冊

-- 首先，確保 users 表存在並啟用 RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 刪除可能存在的舊政策
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;

-- 1. 允許用戶查看自己的資料
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- 2. 允許用戶更新自己的資料
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- 3. 允許在註冊時插入用戶資料（關鍵政策）
-- 這個政策允許已認證的用戶創建自己的記錄
CREATE POLICY "Enable insert for authentication" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. 允許管理員查看所有用戶
CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
