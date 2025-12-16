-- 創建系統設定表
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 插入預設設定
INSERT INTO public.system_settings (key, value, description) VALUES
  ('site_info', '{
    "siteName": "台灣點燈網",
    "siteDescription": "線上祈福點燈平台",
    "contactEmail": "contact@temple-lantern.tw",
    "contactPhone": "02-1234-5678"
  }'::jsonb, '網站基本資訊'),
  
  ('payment_settings', '{
    "platformFeeRate": 5,
    "minOrderAmount": 100,
    "maxOrderAmount": 100000,
    "ecpayMerchantId": "",
    "ecpayHashKey": "",
    "ecpayHashIV": ""
  }'::jsonb, '金流與付款設定'),
  
  ('member_settings', '{
    "enableRegistration": true,
    "enableGoogleLogin": true
  }'::jsonb, '會員相關設定'),
  
  ('notification_settings', '{
    "enableEmailNotification": true,
    "enableSMSNotification": false
  }'::jsonb, '通知設定'),
  
  ('system_settings', '{
    "maintenanceMode": false
  }'::jsonb, '系統設定')
ON CONFLICT (key) DO NOTHING;

-- 設定 RLS 政策
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 只有管理員可以讀取
CREATE POLICY "Admin can read settings"
  ON public.system_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 只有管理員可以更新
CREATE POLICY "Admin can update settings"
  ON public.system_settings
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
CREATE OR REPLACE FUNCTION update_system_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_timestamp();
