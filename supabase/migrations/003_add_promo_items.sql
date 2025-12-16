-- 優惠活動表
CREATE TABLE IF NOT EXISTS public.promo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('lantern', 'event')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    temple_id UUID NOT NULL REFERENCES public.temples(id) ON DELETE CASCADE,
    lantern_id UUID REFERENCES public.lantern_products(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
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

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_promo_items_temple_id ON public.promo_items(temple_id);
CREATE INDEX IF NOT EXISTS idx_promo_items_active ON public.promo_items(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_items_dates ON public.promo_items(sale_start, sale_end);

-- 建立觸發器
CREATE TRIGGER update_promo_items_updated_at BEFORE UPDATE ON public.promo_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.promo_items ENABLE ROW LEVEL SECURITY;

-- 任何人都可以查看有效的優惠
CREATE POLICY "Anyone can view active promo items" ON public.promo_items
    FOR SELECT USING (is_active = true);

-- 廟宇管理員可以管理自己廟宇的優惠
CREATE POLICY "Temple owners can manage their promo items" ON public.promo_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.temples
            WHERE temples.id = promo_items.temple_id
            AND temples.owner_id = auth.uid()
        )
    );
