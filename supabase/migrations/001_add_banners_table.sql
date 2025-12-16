-- 廣告橫幅表
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    image TEXT,
    link TEXT NOT NULL,
    temple_id UUID REFERENCES public.temples(id) ON DELETE CASCADE,
    bg_color TEXT DEFAULT 'from-red-600 to-red-800',
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_dates ON public.banners(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_banners_temple_id ON public.banners(temple_id);

-- 建立觸發器
CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON public.banners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- 任何人都可以查看有效的廣告橫幅
CREATE POLICY "Anyone can view active banners" ON public.banners
    FOR SELECT USING (is_active = true);

-- 管理員可以管理廣告橫幅
CREATE POLICY "Admins can manage banners" ON public.banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- 插入範例廣告橫幅
INSERT INTO public.banners (title, subtitle, link, temple_id, bg_color, is_active, start_date, end_date, display_order) VALUES
    (
        '2025新春祈福特惠',
        '光明燈、平安燈全面8折',
        '/events/new-year-blessing-2025',
        '10000000-0000-0000-0000-000000000001',
        'from-red-600 to-red-800',
        true,
        '2024-01-01 00:00:00+00',
        '2026-12-31 23:59:59+00',
        1
    ),
    (
        '元宵節點燈活動',
        '報名即送精美福袋',
        '/events/yuanxiao-lantern-2025',
        '10000000-0000-0000-0000-000000000002',
        'from-orange-500 to-red-600',
        true,
        '2024-01-01 00:00:00+00',
        '2026-12-31 23:59:59+00',
        2
    ),
    (
        '月老燈特別企劃',
        '祈求良緣，姻緣燈85折',
        '/temples/xingtian-temple',
        '10000000-0000-0000-0000-000000000002',
        'from-pink-500 to-rose-600',
        true,
        '2024-01-01 00:00:00+00',
        '2026-12-31 23:59:59+00',
        3
    )
ON CONFLICT DO NOTHING;
