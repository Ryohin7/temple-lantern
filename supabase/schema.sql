-- 台灣廟宇點燈平台資料庫架構

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 用戶表
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'temple_admin', 'admin')),
    birth_date DATE,
    birth_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 廟宇表
CREATE TABLE IF NOT EXISTS public.temples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    main_god TEXT NOT NULL,
    history TEXT,
    banner_image TEXT,
    logo_image TEXT,
    images TEXT[],
    theme_color TEXT DEFAULT '#dc2626',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 燈種商品表
CREATE TABLE IF NOT EXISTS public.lantern_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    benefits TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    duration_months INTEGER NOT NULL DEFAULT 12 CHECK (duration_months > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image TEXT,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 訂單表
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    temple_id UUID NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    payment_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 訂單項目表
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    lantern_id UUID NOT NULL REFERENCES public.lantern_products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    believer_name TEXT NOT NULL,
    birth_date DATE,
    birth_time TIME,
    wish_text TEXT,
    certificate_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 祈福留言板表
CREATE TABLE IF NOT EXISTS public.blessings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    temple_id UUID NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立索引以優化查詢
CREATE INDEX IF NOT EXISTS idx_temples_slug ON public.temples(slug);
CREATE INDEX IF NOT EXISTS idx_temples_status ON public.temples(status);
CREATE INDEX IF NOT EXISTS idx_temples_owner_id ON public.temples(owner_id);
CREATE INDEX IF NOT EXISTS idx_lantern_products_temple_id ON public.lantern_products(temple_id);
CREATE INDEX IF NOT EXISTS idx_lantern_products_category ON public.lantern_products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_temple_id ON public.orders(temple_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_blessings_temple_id ON public.blessings(temple_id);

-- 建立更新時間戳的函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 為需要自動更新 updated_at 的表建立觸發器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_temples_updated_at BEFORE UPDATE ON public.temples
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lantern_products_updated_at BEFORE UPDATE ON public.lantern_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 政策
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lantern_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blessings ENABLE ROW LEVEL SECURITY;

-- Users 表政策
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Temples 表政策
CREATE POLICY "Anyone can view active temples" ON public.temples
    FOR SELECT USING (status = 'active');

CREATE POLICY "Temple owners can update their temple" ON public.temples
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Temple owners can insert their temple" ON public.temples
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Lantern Products 表政策
CREATE POLICY "Anyone can view active lantern products" ON public.lantern_products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Temple owners can manage their lantern products" ON public.lantern_products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.temples
            WHERE temples.id = lantern_products.temple_id
            AND temples.owner_id = auth.uid()
        )
    );

-- Orders 表政策
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Temple owners can view orders for their temple" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.temples
            WHERE temples.id = orders.temple_id
            AND temples.owner_id = auth.uid()
        )
    );

-- Order Items 表政策
CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Blessings 表政策
CREATE POLICY "Anyone can view public blessings" ON public.blessings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create blessings" ON public.blessings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 插入範例資料（開發用）
-- 這些可以在實際部署時移除

-- 範例廟宇管理員
INSERT INTO public.users (id, email, name, role) VALUES
    ('00000000-0000-0000-0000-000000000001', 'temple1@example.com', '龍山寺管理員', 'temple_admin'),
    ('00000000-0000-0000-0000-000000000002', 'temple2@example.com', '行天宮管理員', 'temple_admin')
ON CONFLICT (email) DO NOTHING;

-- 範例廟宇
INSERT INTO public.temples (id, name, slug, description, address, phone, main_god, status, owner_id, theme_color) VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '艋舺龍山寺',
        'lungshan-temple',
        '艋舺龍山寺，為臺灣臺北市萬華的觀音寺，與臺北大稻埕慈聖宮、臺北大龍峒保安宮合稱「臺北三大廟門」。',
        '臺北市萬華區廣州街211號',
        '02-2302-5162',
        '觀世音菩薩',
        'active',
        '00000000-0000-0000-0000-000000000001',
        '#dc2626'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '臺北行天宮',
        'xingtian-temple',
        '行天宮，俗稱恩主公廟，主祀關聖帝君，為臺灣知名的關帝廟。',
        '臺北市中山區民權東路二段109號',
        '02-2502-7924',
        '關聖帝君',
        'active',
        '00000000-0000-0000-0000-000000000002',
        '#b91c1c'
    )
ON CONFLICT (slug) DO NOTHING;

-- 範例燈種
INSERT INTO public.lantern_products (temple_id, name, description, benefits, price, duration_months, stock, category) VALUES
    (
        '10000000-0000-0000-0000-000000000001',
        '光明燈',
        '點亮心燈，照耀前程',
        '祈求平安順利、前途光明、驅除黑暗、增長智慧',
        1200,
        12,
        100,
        'guangming'
    ),
    (
        '10000000-0000-0000-0000-000000000001',
        '財神燈',
        '招財進寶，財源廣進',
        '祈求財運亨通、生意興隆、財源滾滾、富貴吉祥',
        1800,
        12,
        80,
        'caishen'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '月老燈',
        '牽紅線，結良緣',
        '祈求姻緣美滿、感情順利、覓得良緣、夫妻和睦',
        1500,
        12,
        60,
        'yuelao'
    ),
    (
        '10000000-0000-0000-0000-000000000002',
        '文昌燈',
        '智慧開啟，學業進步',
        '祈求學業進步、考試順利、金榜題名、增長智慧',
        1200,
        12,
        70,
        'wenchang'
    )
ON CONFLICT DO NOTHING;

