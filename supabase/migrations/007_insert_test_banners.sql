-- ===================================
-- 修復橫幅顯示問題：插入測試資料
-- ===================================

-- 1. 檢查現有橫幅
SELECT COUNT(*) as count FROM public.banners;

-- 2. 清空舊資料（可選）
-- DELETE FROM public.banners;

-- 3. 插入測試橫幅（不依賴 temple_id）
INSERT INTO public.banners (
    title, 
    subtitle, 
    link, 
    temple_id,
    bg_color, 
    is_active, 
    start_date, 
    end_date, 
    display_order
) VALUES
    (
        '新春祈福點燈',
        '2025 金蛇年祈福活動開跑',
        '/events',
        NULL,
        'from-red-600 to-red-800',
        true,
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '90 days',
        1
    ),
    (
        '線上點燈優惠',
        '首次點燈享 9 折優惠',
        '/temples',
        NULL,
        'from-orange-600 to-orange-800',
        true,
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '90 days',
        2
    ),
    (
        '月老燈特別企劃',
        '祈求良緣，姻緣燈85折',
        '/temples',
        NULL,
        'from-pink-500 to-rose-600',
        true,
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '90 days',
        3
    )
ON CONFLICT DO NOTHING;

-- 4. 驗證資料
SELECT id, title, is_active, start_date, end_date FROM public.banners;
