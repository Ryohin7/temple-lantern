-- 更新 temple_applications 表，新增 user_id 欄位
ALTER TABLE public.temple_applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 為已存在的申請記錄填入 user_id（如果能找到對應的用戶）
UPDATE public.temple_applications ta
SET user_id = u.id
FROM public.users u
WHERE ta.admin_email = u.email
  AND ta.user_id IS NULL;
