-- 創建廟宇申請表
CREATE TABLE IF NOT EXISTS public.temple_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- 廟宇資訊
  temple_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  main_god TEXT NOT NULL,
  description TEXT,
  -- 管理員資訊
  admin_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_phone TEXT NOT NULL,
  admin_password_hash TEXT NOT NULL,
  -- 申請狀態
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  -- 時間戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 設定 RLS
ALTER TABLE public.temple_applications ENABLE ROW LEVEL SECURITY;

-- 任何人都可以提交申請
CREATE POLICY "Anyone can submit temple application"
  ON public.temple_applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 只有管理員可以查看所有申請
CREATE POLICY "Admin can view all applications"
  ON public.temple_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 只有管理員可以更新申請狀態
CREATE POLICY "Admin can update applications"
  ON public.temple_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_temple_applications_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER temple_applications_updated_at
  BEFORE UPDATE ON public.temple_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_temple_applications_timestamp();

-- 創建索引
CREATE INDEX idx_temple_applications_status ON public.temple_applications(status);
CREATE INDEX idx_temple_applications_created_at ON public.temple_applications(created_at DESC);
