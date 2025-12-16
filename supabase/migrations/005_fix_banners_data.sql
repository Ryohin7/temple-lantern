-- 檢查並修復 banners 表的問題

-- 1. 檢查 banners 表是否有資料
SELECT COUNT(*) as banner_count FROM public.banners;

-- 2. 查看現有的橫幅資料
SELECT id, title, is_active, start_date, end_date, temple_id FROM public.banners;

-- 3. 如果沒有資料或資料有問題，先清空並重新插入（不依賴 temple_id）
DELETE FROM public.banners;

-- 4. 插入新的範例橫幅（temple_id 設為 NULL）
INSERT INTO public.banners (title, subtitle, link, temple_id, bg_color, is_active, start_date, end_date, display_order) VALUES
    (
        '2025新春祈福特惠',
        '光明燈、平安燈全面8折',
        '/events',
        NULL,  -- 不依賴特定廟宇
        'from-red-600 to-red-800',
        true,
        '2024-01-01 00:00:00+00',
        '2026-12-31 23:59:59+00',
        1
    ),
    (
        '元宵節點燈活動',
        '報名即送精美福袋',
        '/events',
        NULL,
        'from-orange-500 to-red-600',
        true,
        '2024-01-01 00:00:00+00',
        '2026-12-31 23:59:59+00',
        2
    ),
    (
        '線上點燈優惠',
        '首次點燈享 9 折優惠',
        '/temples',
        NULL,
        'from-pink-500 to-rose-600',
        true,
        '2024-01-01 00:00:00+00',
        '2026-12-31 23:59:59+00',
        3
    );

-- 5. 驗證資料已插入
SELECT id, title, is_active, start_date, end_date FROM public.banners;
