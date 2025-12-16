# 🔧 台灣點燈網 - 完整待辦清單

**最後更新：** 2025-12-16 18:09  
**專案狀態：** 核心功能已完成，部分功能待實作  
**GitHub：** https://github.com/Ryohin7/temple-lantern  
**Vercel：** https://temple-lantern.vercel.app

---

## 🚨 立即需要執行（Critical）

### 1. 執行資料庫 Migrations
**狀態：** ⏳ 待執行  
**位置：** Supabase Dashboard → SQL Editor

需要執行以下 migrations（按順序）：

```sql
-- 1. 系統設定表 (009_system_settings.sql)
-- 已在專案中，需在 Supabase 執行

-- 2. 廟宇申請表 (010_temple_applications.sql)
-- 已在專案中，需在 Supabase 執行

-- 3. 頁面內容表 (011_page_contents.sql)
-- 已在專案中，需在 Supabase 執行

-- 4. 新增 user_id 欄位 (012_add_user_id_to_applications.sql)
ALTER TABLE public.temple_applications 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

UPDATE public.temple_applications ta
SET user_id = u.id
FROM public.users u
WHERE ta.admin_email = u.email AND ta.user_id IS NULL;

-- 5. 修復 trigger (013_fix_user_trigger_upsert.sql)
-- 已在專案中，需在 Supabase 執行
```

### 2. 修復已存在廟宇的 Slug
**狀態：** ⏳ 待執行  
**問題：** 中文 slug 導致 URL 無法訪問

```sql
-- 方案 A：使用時間戳
UPDATE public.temples 
SET slug = 'temple-' || EXTRACT(EPOCH FROM created_at)::bigint * 1000
WHERE slug LIKE '%中%' OR slug LIKE '%台%';

-- 方案 B：手動設定
UPDATE public.temples 
SET slug = 'taiwan-temple-1'
WHERE name = '台灣神嚴寺';
```

### 3. 設定 Vercel 環境變數
**狀態：** ⏳ 待確認  
**位置：** Vercel Dashboard → Settings → Environment Variables

必須設定：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  ← 重要！
```

---

## 🔴 高優先級（High Priority）

### 4. 完成廟宇申請批准流程
**狀態：** 🔄 部分完成  
**已完成：**
- ✅ 創建 Auth 用戶
- ✅ 更新用戶 role 為 temple_admin
- ✅ 創建 temples 記錄

**待完成：**
- ❌ 發送批准通知 Email
- ❌ 發送拒絕通知 Email

**實作建議：**
- 使用 Resend 或 SendGrid
- Email 模板包含登入資訊
- 記錄發送狀態

### 5. 廟方管理後台 - 燈種管理
**狀態：** ❌ 缺失  
**問題：** `/temple-admin/lanterns/new` 調用不存在的 API

**需要創建：**
- `app/api/temple-admin/lanterns/route.ts` (POST, GET, PUT, DELETE)

**參考程式碼：**
```typescript
// POST - 創建燈種
export async function POST(request: NextRequest) {
  const supabase = createClient()
  
  // 1. 檢查 temple_admin 權限
  // 2. 獲取廟宇 ID (from temples where owner_id = user.id)
  // 3. 插入 lantern_products 表
  // 4. 返回結果
}
```

### 6. 廟方管理後台 - 法會管理
**狀態：** ❌ 缺失  
**問題：**
- 「新增法會」按鈕沒有連結
- 缺少新增法會頁面
- 缺少 API

**需要創建：**
1. 修改 `app/temple-admin/events/page.tsx` 第 50 行：
```typescript
<Link href="/temple-admin/events/new">
  <Button variant="temple">
    <Plus className="w-4 h-4 mr-2" />
    新增法會
  </Button>
</Link>
```

2. 創建 `app/temple-admin/events/new/page.tsx`
3. 創建 `app/api/temple-admin/events/route.ts`

### 7. 活動編輯頁面
**狀態：** ✅ 已完成 (2025-12-16)
**位置：** `app/admin/events/[id]/edit/page.tsx`
**已完成：**
- [x] 創建編輯頁面
- [x] 預填現有資料
- [x] 連接到 PUT API

---

## 🟡 中優先級（Medium Priority）

### 8. 內容管理系統 - 編輯器
**狀態：** ✅ 已完成 (2025-12-16)
**已完成：**
- ✅ 資料庫表 (page_contents)
- ✅ API (GET/PUT)
- ✅ 管理員編輯介面 (`/admin/content/[page]/page.tsx`)
- ✅ 移除 Mock Data

**待完成：**
- ❌ 富文本編輯器整合（建議使用 TipTap 或 Quill）
- ❌ 靜態頁面動態化（從資料庫讀取內容）

**需要更新的頁面：**
- `/how-it-works`
- `/faq`
- `/about`
- `/privacy`
- `/terms`

### 9. 圖片上傳功能
**狀態：** ❌ 缺失  
**需要：**
- Supabase Storage 整合
- 圖片壓縮（建議使用 sharp）
- 上傳進度顯示
- 圖片預覽

**適用於：**
- 廟宇 banner/logo
- 燈種圖片
- 活動圖片
- 橫幅廣告

### 10. Email 通知系統
**狀態：** ❌ 缺失  
**需要整合：**
- Email 服務（Resend / SendGrid / AWS SES）
- Email 模板
- 發送邏輯

**通知類型：**
- 訂單確認
- 廟宇申請審核結果
- 點燈完成通知
- 密碼重設

### 11. 金流整合
**狀態：** ❌ 缺失  
**建議金流：**
- 綠界支付（ECPay）
- 藍新金流（NewebPay）

**需要實作：**
- 付款頁面
- 付款回調處理
- 訂單狀態更新
- 交易記錄

---

## 🟢 低優先級（Low Priority）

### 12. 進階報表功能
**狀態：** 🔄 基礎完成  
**已完成：**
- ✅ 財務報表 API
- ✅ 基本統計數據

**可優化：**
- 圖表視覺化（Chart.js / Recharts）
- 匯出 Excel/PDF
- 自訂日期範圍
- 更詳細的分析

### 13. 搜尋功能優化
**狀態：** ✅ 基本完成  
**可優化：**
- 全文搜尋（Supabase Full-Text Search）
- 搜尋建議
- 搜尋歷史
- 熱門搜尋

### 14. 效能優化
**可優化項目：**
- 圖片 lazy loading
- 路由預載（Next.js prefetch）
- API 回應快取
- 資料庫查詢優化
- CDN 設定

### 15. SEO 優化
**可優化項目：**
- 動態 meta tags
- Sitemap 生成
- robots.txt
- Schema.org 結構化資料
- Open Graph 標籤

---

## 🐛 已知 Bug

### Bug 1: promo_items 表不存在
**狀態:** ✅ 已修復 (2025-12-16)  
**錯誤訊息：** `Could not find the table 'public.promo_items'`  
**影響：** 某個頁面嘗試查詢不存在的表  
**修復：** 已在 `014_complete_setup.sql` 中創建該表

### Bug 2: 廟方訂單頁面
**狀態：** ✅ 已修復 (2025-12-16)  
**位置：** `/temple-admin/orders`  
**修復：** 修正 API 返回格式，從巢狀物件改為扁平陣列

---

## 📋 資料庫優化建議

### 索引優化
```sql
-- 為常用查詢欄位添加索引
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_temple_id ON orders(temple_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lantern_products_temple_id ON lantern_products(temple_id);
CREATE INDEX IF NOT EXISTS idx_events_temple_id ON events(temple_id);
```

### RLS 政策檢查
- 確認所有表都啟用 RLS
- 檢查政策是否過於寬鬆
- 測試不同角色的存取權限

---

## 🎨 UI/UX 改進建議

### 1. 載入狀態
- 統一 loading 組件
- Skeleton screens
- 進度指示器

### 2. 錯誤處理
- 友善的錯誤訊息
- 錯誤邊界（Error Boundaries）
- 重試機制

### 3. 表單驗證
- 即時驗證
- 清楚的錯誤提示
- 防止重複提交

### 4. 響應式設計
- 測試所有頁面在手機上的顯示
- 優化觸控體驗
- 改善小螢幕佈局

---

## 📝 文檔待補充

### 技術文檔
- [ ] API 文檔（所有端點）
- [ ] 資料庫 Schema 文檔
- [ ] 部署流程文檔
- [ ] 環境變數說明

### 使用者文檔
- [ ] 管理員操作手冊
- [ ] 廟方操作手冊
- [ ] 常見問題 FAQ
- [ ] 故障排除指南

---

## 🔒 安全性檢查

### 待檢查項目
- [ ] 所有 API 都有權限檢查
- [ ] 敏感資料加密
- [ ] SQL Injection 防護
- [ ] XSS 防護
- [ ] CSRF Token
- [ ] Rate Limiting
- [ ] 密碼強度要求

---

## 🧪 測試

### 待補充測試
- [ ] 單元測試
- [ ] 整合測試
- [ ] E2E 測試
- [ ] 效能測試
- [ ] 安全性測試

---

## 📊 監控與日誌

### 待實作
- [ ] 錯誤追蹤（Sentry）
- [ ] 效能監控（Vercel Analytics）
- [ ] 使用者行為分析
- [ ] API 監控
- [ ] 資料庫效能監控

---

## 🎯 下次開始工作時

### 立即執行（5分鐘）
1. 在 Supabase 執行所有 migrations
2. 設定 Vercel 環境變數
3. 修復已存在廟宇的 slug

### 優先開發（1-2小時）
4. 創建廟方燈種管理 API
5. 創建廟方法會管理功能
6. 測試廟方完整流程

### 後續開發（3-5小時）
7. 實作 Email 通知
8. 完成內容管理編輯器
9. 整合圖片上傳

---

## 📞 重要資訊

### Supabase 憑證
- Dashboard: https://supabase.com/dashboard
- 專案 URL: 在 .env.local 中
- Service Role Key: 在 Supabase Settings → API

### GitHub
- Repo: https://github.com/Ryohin7/temple-lantern
- 最新 Commit: 9748082

### Vercel
- Dashboard: https://vercel.com/dashboard
- 專案: temple-lantern
- 部署 URL: https://temple-lantern.vercel.app

---

**💡 提示：回家後直接將此文檔貼給我，我會從最高優先級開始幫您實作！**
