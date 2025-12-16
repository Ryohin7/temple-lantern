# 🚀 開始使用台灣點燈網

歡迎！這份文檔將幫助您快速上手這個專案。

## 📋 您需要什麼

### 必要工具
- ✅ Node.js 18.x 或更新版本
- ✅ npm 或 yarn
- ✅ Git
- ✅ 程式碼編輯器（推薦 VS Code）

### 建議安裝
- VS Code 擴充套件：
  - ES Lint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin (Volar)

## 🎯 三步驟快速開始

### 步驟 1：安裝專案

```bash
# 進入專案目錄
cd temple-lantern

# 安裝所有依賴套件
npm install
```

等待安裝完成...

### 步驟 2：設定環境變數

#### 選項 A：暫時跳過（先看看介面）
專案可以直接啟動，但無法連線到資料庫。

```bash
# 直接啟動
npm run dev
```

#### 選項 B：設定 Supabase（完整功能）

1. 前往 [Supabase](https://supabase.com) 註冊帳號
2. 建立新專案
3. 取得 API 金鑰：
   - Project URL
   - anon public key

4. 在專案根目錄建立 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. 在 Supabase Dashboard > SQL Editor 執行：
   - 複製 `supabase/schema.sql` 的內容
   - 貼上並執行

### 步驟 3：啟動開發伺服器

```bash
npm run dev
```

✅ 完成！開啟瀏覽器訪問：**http://localhost:3000**

## 🎨 專案導覽

### 主要頁面
開啟瀏覽器後，您可以訪問：

- **首頁**：http://localhost:3000
- **廟宇列表**：http://localhost:3000/temples
- **購物車**：http://localhost:3000/cart
- **廟宇註冊**：http://localhost:3000/temple-admin/register

### 試試這些功能

1. **瀏覽廟宇**
   - 首頁 → 點擊「開始點燈祈福」
   - 搜尋「龍山寺」或「行天宮」
   - 點擊廟宇卡片查看詳情

2. **購物流程**
   - 在廟宇頁面選擇燈種
   - 點擊「點燈祈福」加入購物車
   - 填寫點燈人資訊
   - 前往結帳

3. **體驗動畫**
   - 注意頁面中飄動的燈籠 🏮
   - Hover 卡片看放大效果
   - 完成結帳看煙火特效 🎆

## 📁 專案結構速覽

```
temple-lantern/
├── app/              → 所有頁面都在這裡
│   ├── page.tsx      → 首頁
│   ├── temples/      → 廟宇相關頁面
│   ├── cart/         → 購物車
│   └── checkout/     → 結帳
│
├── components/       → React 組件
│   ├── temple/       → 廟宇相關組件
│   ├── layout/       → Header、Footer
│   └── ui/           → 按鈕、卡片等基礎組件
│
├── lib/              → 工具函式
│   ├── supabase.ts   → 資料庫連線
│   ├── store.ts      → 狀態管理
│   └── utils.ts      → 通用函式
│
└── supabase/         → 資料庫架構
    └── schema.sql    → 建立資料表的 SQL
```

## 🛠️ 常用指令

```bash
# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 執行生產版本
npm run start

# 檢查 TypeScript 錯誤
npm run type-check

# 檢查程式碼風格
npm run lint
```

## 🎓 學習資源

### 技術文檔
- [Next.js 文檔](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase 文檔](https://supabase.com/docs)

### 專案文檔
- `README.md` - 專案總覽
- `FEATURES.md` - 功能清單
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `PROJECT_SUMMARY.md` - 專案詳細資訊

## 🐛 遇到問題？

### 常見問題

#### Q: `npm install` 失敗
```bash
# 清除快取
npm cache clean --force

# 刪除 node_modules 重新安裝
rm -rf node_modules package-lock.json
npm install
```

#### Q: 頁面顯示空白
- 檢查 Console 是否有錯誤訊息
- 確認是否在專案目錄下執行 `npm run dev`
- 確認 port 3000 沒被其他程式佔用

#### Q: 圖片不顯示
- 範例圖片需要自行準備或使用範例資料
- 確認 `next.config.js` 的圖片域名設定

#### Q: Supabase 連線失敗
- 確認 `.env.local` 檔案存在
- 確認環境變數的值正確無誤
- 重新啟動開發伺服器

### 需要協助？

1. 查看專案文檔
2. 搜尋相關技術文檔
3. 建立 GitHub Issue
4. 聯絡：contact@temple-lantern.tw

## 🎯 接下來做什麼？

### 初學者建議
1. ✅ 先把專案跑起來
2. 📖 閱讀 `README.md` 了解專案
3. 🎨 修改一些文字或顏色試試看
4. 🧩 研究 `components/` 裡的組件
5. 📱 試著新增一個簡單頁面

### 進階開發者建議
1. 📊 研究資料庫 Schema（`supabase/schema.sql`）
2. 🔌 查看 API 設計（`docs/API_DESIGN.md`）
3. 🛠️ 實作後端 API
4. 🔐 加入認證系統
5. 💰 整合金流

### 想要貢獻？
閱讀 `CONTRIBUTING.md` 了解如何為專案做出貢獻！

## 🌟 專案特色

讓您快速認識這個專案的亮點：

### 視覺設計 🎨
- 精美的台灣廟宇風格
- 流暢的動畫效果
- 完整的響應式設計

### 技術架構 🏗️
- Next.js 14 (最新版)
- TypeScript (完整支援)
- Tailwind CSS (現代化樣式)
- Framer Motion (動畫庫)

### 功能完整度 ✨
- 完整的購物流程
- 直覺的操作介面
- 詳細的錯誤處理
- 貼心的使用者體驗

## 📞 保持聯繫

- **Email**: contact@temple-lantern.tw
- **GitHub**: [Repository]
- **文檔**: 查看專案根目錄的 Markdown 檔案

---

## 🎉 開始您的開發之旅！

現在您已經準備好了！

```bash
# 開始開發
npm run dev

# 在瀏覽器打開
# http://localhost:3000
```

**祝您開發順利！** 🏮✨

---

*如有任何問題，歡迎隨時查看其他文檔或聯繫我們。*






