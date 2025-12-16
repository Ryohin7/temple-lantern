-- 創建頁面內容管理表
CREATE TABLE IF NOT EXISTS public.page_contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT UNIQUE NOT NULL, -- 'how-it-works', 'faq', 'about', 'privacy', 'terms'
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- 儲存結構化內容
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
CREATE POLICY "Anyone can read page contents"
  ON public.page_contents
  FOR SELECT
  TO public
  USING (true);

-- 只有管理員可以更新
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

CREATE TRIGGER page_contents_updated_at
  BEFORE UPDATE ON public.page_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_page_contents_timestamp();
