-- =====================================================
-- Migration 016: Notifications and Coupons Tables
-- =====================================================
-- 目的：創建通知系統和折扣碼管理所需的資料表
-- 日期：2025-12-16
-- =====================================================

-- 1. 創建 notifications 表
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('order_confirmed', 'payment_success', 'lighting_complete', 'expiry_reminder', 'promotion', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read) WHERE is_read = false;

-- RLS 政策
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 用戶只能看到自己的通知
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

-- 用戶可以更新自己的通知（標記已讀）
CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- 用戶可以刪除自己的通知
CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    USING (auth.uid() = user_id);

-- 系統可以創建通知（使用 service role）
CREATE POLICY "Service role can insert notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 2. 創建 coupons 表
-- =====================================================

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
    value NUMERIC(10, 2) NOT NULL CHECK (value >= 0),
    min_order_amount NUMERIC(10, 2) DEFAULT 0 CHECK (min_order_amount >= 0),
    max_discount NUMERIC(10, 2) CHECK (max_discount IS NULL OR max_discount >= 0),
    usage_limit INTEGER DEFAULT 100 CHECK (usage_limit > 0),
    used_count INTEGER DEFAULT 0 CHECK (used_count >= 0),
    per_user_limit INTEGER DEFAULT 1 CHECK (per_user_limit > 0),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    applicable_temples UUID[],  -- 適用廟宇 ID 陣列，NULL 表示全部
    applicable_lanterns TEXT[],  -- 適用燈種類別，NULL 表示全部
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_coupons_dates ON public.coupons(start_date, end_date);

-- RLS 政策
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 所有人都可以查看啟用的折扣碼
CREATE POLICY "Anyone can view active coupons"
    ON public.coupons FOR SELECT
    USING (is_active = true AND NOW() BETWEEN start_date AND end_date);

-- 只有管理員可以管理折扣碼
CREATE POLICY "Admins can manage coupons"
    ON public.coupons FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- =====================================================
-- 3. 創建 coupon_usage 表（追蹤折扣碼使用記錄）
-- =====================================================

CREATE TABLE IF NOT EXISTS public.coupon_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    discount_amount NUMERIC(10, 2) NOT NULL CHECK (discount_amount >= 0),
    used_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coupon_id, order_id)
);

-- 創建索引
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON public.coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_user_id ON public.coupon_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON public.coupon_usage(order_id);

-- RLS 政策
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;

-- 用戶可以查看自己的使用記錄
CREATE POLICY "Users can view their own coupon usage"
    ON public.coupon_usage FOR SELECT
    USING (auth.uid() = user_id);

-- 系統可以創建使用記錄
CREATE POLICY "Service role can insert coupon usage"
    ON public.coupon_usage FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 4. 創建觸發器：自動更新 coupons.updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_coupons_updated_at
    BEFORE UPDATE ON public.coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_coupons_updated_at();

-- =====================================================
-- 5. 創建觸發器：自動更新 coupons.used_count
-- =====================================================

CREATE OR REPLACE FUNCTION increment_coupon_used_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.coupons
    SET used_count = used_count + 1
    WHERE id = NEW.coupon_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_coupon_used_count
    AFTER INSERT ON public.coupon_usage
    FOR EACH ROW
    EXECUTE FUNCTION increment_coupon_used_count();

-- =====================================================
-- 6. 註解
-- =====================================================

COMMENT ON TABLE public.notifications IS '用戶通知表';
COMMENT ON TABLE public.coupons IS '折扣碼管理表';
COMMENT ON TABLE public.coupon_usage IS '折扣碼使用記錄表';
