-- ============================================
-- 完整資料庫設定與 Bug 修復
-- ============================================
-- 此檔案包含：
-- 1. Migration 009-013（系統設定、廟宇申請、頁面內容等）
-- 2. 修復 promo_items 表（Bug #1）
-- 3. 修復中文 slug 問題（Bug #2 相關）
-- ============================================

-- ============================================
-- 009: 系統設定表
-- ============================================

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
DROP POLICY IF EXISTS "Admin can read settings" ON public.system_settings;
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
DROP POLICY IF EXISTS "Admin can update settings" ON public.system_settings;
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

DROP TRIGGER IF EXISTS system_settings_updated_at ON public.system_settings;
CREATE TRIGGER system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_system_settings_timestamp();

-- ============================================
-- 010: 廟宇申請表
-- ============================================

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

-- 任何人都可以提交申請（包含未登入用戶）
DROP POLICY IF EXISTS "Anyone can submit temple application" ON public.temple_applications;
CREATE POLICY "Anyone can submit temple application"
  ON public.temple_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 只有管理員可以查看所有申請
DROP POLICY IF EXISTS "Admin can view all applications" ON public.temple_applications;
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
DROP POLICY IF EXISTS "Admin can update applications" ON public.temple_applications;
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

DROP TRIGGER IF EXISTS temple_applications_updated_at ON public.temple_applications;
CREATE TRIGGER temple_applications_updated_at
  BEFORE UPDATE ON public.temple_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_temple_applications_timestamp();

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_temple_applications_status ON public.temple_applications(status);
CREATE INDEX IF NOT EXISTS idx_temple_applications_created_at ON public.temple_applications(created_at DESC);

-- ============================================
-- 011: 頁面內容管理表
-- ============================================

CREATE TABLE IF NOT EXISTS public.page_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  meta_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- 插入預設內容
INSERT INTO public.page_contents (page_key, title, content, meta_description) VALUES
  ('how-it-works', '如何點燈', '{
    "sections": [
      {
        "title": "選擇廟宇",
        "content": "瀏覽我們精選的廟宇，選擇您想要點燈的廟宇。"
      },
      {
        "title": "選擇點燈方案",
        "content": "每間廟宇提供不同的點燈方案，選擇最適合您的方案。"
      },
      {
        "title": "填寫祈福資訊",
        "content": "填寫您的姓名、生辰八字等祈福資訊。"
      },
      {
        "title": "完成付款",
        "content": "使用信用卡、ATM 或超商代碼完成付款。"
      },
      {
        "title": "廟方點燈",
        "content": "廟方收到訂單後會為您點燈祈福，並提供點燈照片。"
      }
    ]
  }'::jsonb, '了解如何在台灣點燈網進行線上點燈祈福'),
  
  ('faq', '常見問題', '{
    "faqs": [
      {
        "question": "什麼是點燈？",
        "answer": "點燈是一種祈福儀式，透過在神明面前點燃燈火，祈求平安、健康、事業順利等。"
      },
      {
        "question": "線上點燈和現場點燈有什麼不同？",
        "answer": "線上點燈由廟方代為點燈，效果與現場點燈相同，但更加方便快速。"
      },
      {
        "question": "點燈需要多久時間？",
        "answer": "一般在付款後 1-3 個工作天內，廟方會完成點燈並提供照片。"
      },
      {
        "question": "可以取消訂單嗎？",
        "answer": "付款後如廟方尚未點燈，可以申請退款。已點燈的訂單無法退款。"
      }
    ]
  }'::jsonb, '台灣點燈網常見問題解答'),
  
  ('about', '關於我們', '{
    "sections": [
      {
        "title": "我們的使命",
        "content": "台灣點燈網致力於將傳統信仰與現代科技結合，讓信眾能夠更便利地進行祈福點燈。"
      },
      {
        "title": "服務特色",
        "content": "我們與全台優質廟宇合作，提供安全可靠的線上點燈服務，讓您隨時隨地都能為自己和家人祈福。"
      }
    ]
  }'::jsonb, '認識台灣點燈網'),
  
  ('privacy', '隱私權政策', '{
    "sections": [
      {
        "title": "資料蒐集",
        "content": "我們僅蒐集必要的個人資料，包括姓名、聯絡方式等，用於提供點燈服務。"
      },
      {
        "title": "資料使用",
        "content": "您的個人資料僅用於處理訂單和提供服務，不會用於其他商業用途。"
      },
      {
        "title": "資料保護",
        "content": "我們採用業界標準的安全措施保護您的個人資料。"
      }
    ]
  }'::jsonb, '台灣點燈網隱私權政策'),
  
  ('terms', '服務條款', '{
    "sections": [
      {
        "title": "服務說明",
        "content": "台灣點燈網提供線上點燈預約服務，實際點燈由合作廟宇執行。"
      },
      {
        "title": "付款與退款",
        "content": "付款後如廟方尚未點燈，可申請退款。已點燈的訂單無法退款。"
      },
      {
        "title": "責任限制",
        "content": "本平台僅提供媒合服務，點燈效果由廟方負責。"
      }
    ]
  }'::jsonb, '台灣點燈網服務條款')
ON CONFLICT (page_key) DO NOTHING;

-- 設定 RLS
ALTER TABLE public.page_contents ENABLE ROW LEVEL SECURITY;

-- 所有人都可以讀取
DROP POLICY IF EXISTS "Anyone can read page contents" ON public.page_contents;
CREATE POLICY "Anyone can read page contents"
  ON public.page_contents
  FOR SELECT
  TO public
  USING (true);

-- 只有管理員可以更新
DROP POLICY IF EXISTS "Admin can update page contents" ON public.page_contents;
CREATE POLICY "Admin can update page contents"
  ON public.page_contents
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
CREATE OR REPLACE FUNCTION update_page_contents_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS page_contents_updated_at ON public.page_contents;
CREATE TRIGGER page_contents_updated_at
  BEFORE UPDATE ON public.page_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_page_contents_timestamp();

-- ============================================
-- 012: 新增 user_id 到 temple_applications
-- ============================================

ALTER TABLE public.temple_applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 為已存在的申請記錄填入 user_id
UPDATE public.temple_applications ta
SET user_id = u.id
FROM public.users u
WHERE ta.admin_email = u.email
  AND ta.user_id IS NULL;

-- ============================================
-- 013: 修復 User Trigger (Upsert)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, phone, role, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, public.users.name),
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        updated_at = NOW();
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 014: 創建 promo_items 表（Bug #1 修復）
-- ============================================
-- 注意：event_id 外鍵約束需要 events 表存在
-- 如果 events 表不存在，請先執行 002_add_events_and_notifications.sql

CREATE TABLE IF NOT EXISTS public.promo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('lantern', 'event')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    temple_id UUID NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
    lantern_id UUID REFERENCES public.lantern_products(id) ON DELETE CASCADE,
    event_id UUID, -- 暫時不加外鍵約束，避免 events 表不存在時失敗
    original_price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    sold INTEGER DEFAULT 0,
    sale_start TIMESTAMP WITH TIME ZONE NOT NULL,
    sale_end TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT valid_price CHECK (sale_price < original_price),
    CONSTRAINT valid_stock CHECK (sold <= stock)
);

-- 如果 events 表存在，則添加外鍵約束（可選）
-- 如果執行失敗，表示 events 表不存在，可以忽略此錯誤
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events') THEN
        ALTER TABLE public.promo_items 
        ADD CONSTRAINT fk_promo_items_event_id 
        FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_promo_items_temple_id ON public.promo_items(temple_id);
CREATE INDEX IF NOT EXISTS idx_promo_items_active ON public.promo_items(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_items_dates ON public.promo_items(sale_start, sale_end);

-- 建立觸發器（需要先確保 update_updated_at_column 函數存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_promo_items_updated_at ON public.promo_items;
CREATE TRIGGER update_promo_items_updated_at 
BEFORE UPDATE ON public.promo_items
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.promo_items ENABLE ROW LEVEL SECURITY;

-- 任何人都可以查看有效的優惠
DROP POLICY IF EXISTS "Anyone can view active promo items" ON public.promo_items;
CREATE POLICY "Anyone can view active promo items" 
ON public.promo_items
FOR SELECT 
USING (is_active = true);

-- 廟宇管理員可以管理自己廟宇的優惠
DROP POLICY IF EXISTS "Temple owners can manage their promo items" ON public.promo_items;
CREATE POLICY "Temple owners can manage their promo items" 
ON public.promo_items
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.temples
        WHERE temples.id = promo_items.temple_id
        AND temples.owner_id = auth.uid()
    )
);

-- ============================================
-- 修復中文 Slug（針對已存在的廟宇）
-- ============================================

-- 方案：使用時間戳生成唯一的 slug
UPDATE public.temples 
SET slug = 'temple-' || EXTRACT(EPOCH FROM created_at)::bigint * 1000
WHERE slug ~ '[^\x00-\x7F]' -- 匹配非 ASCII 字符（中文等）
  OR slug LIKE '%中%' 
  OR slug LIKE '%台%'
  OR slug LIKE '%灣%';

-- ============================================
-- 完成！
-- ============================================
-- 執行此檔案後，請確認：
-- 1. promo_items 表已創建
-- 2. 中文 slug 已修復
-- 3. 系統設定、廟宇申請、頁面內容表已創建
-- ============================================
