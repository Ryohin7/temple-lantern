-- ============================================
-- 補充：創建 events 表（如果不存在）
-- ============================================
-- 此檔案包含 events 和 notifications 表的創建
-- 如果您在執行 014_complete_setup.sql 時遇到 events 表不存在的錯誤
-- 請先執行此檔案，然後再執行 014_complete_setup.sql
-- ============================================

-- 法會活動表
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    temple_id UUID NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    participants INTEGER DEFAULT 0,
    max_participants INTEGER NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    highlights TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 通知表
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('order_confirmed', 'payment_success', 'lighting_complete', 'expiry_reminder', 'promotion', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_temple_id ON public.events(temple_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- 建立觸發器
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Events 表政策
DROP POLICY IF EXISTS "Anyone can view active events" ON public.events;
CREATE POLICY "Anyone can view active events" ON public.events
    FOR SELECT USING (status IN ('upcoming', 'ongoing'));

DROP POLICY IF EXISTS "Temple owners can manage their events" ON public.events;
CREATE POLICY "Temple owners can manage their events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.temples
            WHERE temples.id = events.temple_id
            AND temples.owner_id = auth.uid()
        )
    );

-- Notifications 表政策
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 插入範例法會活動（可選）
INSERT INTO public.events (slug, title, temple_id, date, time, location, description, price, max_participants, category, status, highlights) VALUES
    (
        'new-year-blessing-2025',
        '2025新春祈福法會',
        '10000000-0000-0000-0000-000000000001',
        '2025-01-25',
        '09:00 - 17:00',
        '龍山寺正殿',
        '迎接金蛇年，祈求新年平安順利、闔家安康',
        2000,
        300,
        '新春法會',
        'upcoming',
        ARRAY['法師誦經祈福', '點燈祈願', '過火儀式', '領取福袋']
    ),
    (
        'yuanxiao-lantern-2025',
        '元宵節點燈祈福',
        '10000000-0000-0000-0000-000000000002',
        '2025-02-12',
        '18:00 - 21:00',
        '行天宮廣場',
        '元宵佳節，點亮希望之燈，祈求一年好運',
        1500,
        200,
        '元宵法會',
        'upcoming',
        ARRAY['花燈展示', '祈福點燈', '猜燈謎', '湯圓品嚐']
    )
ON CONFLICT (slug) DO NOTHING;
