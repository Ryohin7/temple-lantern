# 🏮 台灣點燈網 - 線上祈福點燈平台

連結傳統與現代，讓祈福更簡單。線上點燈，心誠則靈。

## 📖 專案簡介

台灣點燈網是一個創新的線上祈福點燈平台，為傳統廟宇提供數位化服務，讓信眾可以透過網路選擇廟宇、點燈種類，並完成線上付款，讓神明的祝福不受距離限制。

### ✨ 核心功能

- 🏯 **多廟宇系統**：不同廟宇可註冊並管理自己的線上點燈服務
- 🏮 **多樣燈種**：光明燈、財神燈、月老燈、文昌燈等八種燈種
- 🛒 **完整購物流程**：購物車、結帳、付款整合
- 👤 **會員系統**：用戶、廟宇管理員、平台管理員三種角色
- 🎨 **台灣廟宇風格**：豐富的動畫效果與互動設計
- 📱 **響應式設計**：支援桌面、平板、手機等各種裝置

## 🛠 技術架構

### 前端技術

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 組件**: Radix UI + 自訂組件
- **動畫**: Framer Motion
- **狀態管理**: Zustand
- **字體**: Noto Sans TC, Noto Serif TC

### 後端技術

- **資料庫**: Supabase (PostgreSQL)
- **認證**: Supabase Auth
- **儲存**: Supabase Storage
- **即時訂閱**: Supabase Realtime

### 金流整合（計劃中）

- 綠界支付 (ECPay)
- 藍新金流

## 📦 安裝與設定

### 1. 安裝依賴套件

```bash
cd temple-lantern
npm install
```

### 2. 環境變數設定

複製 `.env.local.example` 為 `.env.local` 並填入您的配置：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 金流（選填）
ECPAY_MERCHANT_ID=your_merchant_id
ECPAY_HASH_KEY=your_hash_key
ECPAY_HASH_IV=your_hash_iv

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 資料庫設定

在 Supabase 專案中執行 `supabase/schema.sql` 來建立所有必要的資料表和政策。

### 4. 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

## 📁 專案結構

```
temple-lantern/
├── app/                          # Next.js App Router 頁面
│   ├── (public)/                # 公開頁面
│   │   ├── page.tsx            # 首頁
│   │   ├── temples/            # 廟宇相關頁面
│   │   ├── cart/               # 購物車
│   │   └── checkout/           # 結帳
│   ├── (auth)/                 # 認證相關頁面
│   ├── (dashboard)/            # 儀表板
│   │   ├── user/              # 用戶後台
│   │   └── temple-admin/      # 廟宇管理後台
│   └── globals.css            # 全域樣式
├── components/                  # React 組件
│   ├── temple/                # 廟宇相關組件
│   │   ├── Lantern.tsx       # 燈籠組件
│   │   ├── LanternCard.tsx   # 燈種卡片
│   │   ├── TempleCard.tsx    # 廟宇卡片
│   │   └── TempleDecoration.tsx # 裝飾效果
│   ├── layout/                # 佈局組件
│   │   ├── Header.tsx        # 頁首
│   │   └── Footer.tsx        # 頁尾
│   └── ui/                    # 基礎 UI 組件
├── lib/                        # 工具函式與設定
│   ├── supabase.ts           # Supabase 客戶端
│   ├── store.ts              # Zustand 狀態管理
│   └── utils.ts              # 工具函式
├── supabase/                   # 資料庫相關
│   └── schema.sql            # 資料庫架構
├── public/                     # 靜態資源
│   └── images/               # 圖片
├── package.json               # 專案依賴
├── tsconfig.json             # TypeScript 設定
├── tailwind.config.ts        # Tailwind CSS 設定
└── next.config.js            # Next.js 設定
```

## 🎨 燈種類別

| 圖示 | 名稱 | 功效 |
|------|------|------|
| 🏮 | 光明燈 | 照亮前程，驅除黑暗 |
| 💰 | 財神燈 | 招財進寶，財源廣進 |
| 💕 | 月老燈 | 姻緣美滿，愛情順利 |
| 📚 | 文昌燈 | 學業進步，金榜題名 |
| 🙏 | 平安燈 | 闔家平安，身體健康 |
| ⭐ | 太歲燈 | 化解沖犯，諸事順利 |
| 💼 | 事業燈 | 事業亨通，步步高升 |
| ❤️ | 健康燈 | 身體康健，疾病消除 |

## 🚀 部署

### Vercel 部署（推薦）

1. 將專案推送到 GitHub
2. 在 Vercel 導入專案
3. 設定環境變數
4. 部署完成！

### 手動部署

```bash
npm run build
npm run start
```

## 📝 待開發功能

- [ ] 用戶認證系統（登入/註冊）
- [ ] 廟宇管理後台
- [ ] 訂單管理系統
- [ ] 金流整合（綠界/藍新）
- [ ] 點燈證明自動生成
- [ ] 祈福留言板
- [ ] 電子郵件通知
- [ ] 3D 廟宇場景
- [ ] 音效系統（木魚、鐘聲）

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📄 授權

MIT License

## 📞 聯絡方式

- Email: contact@temple-lantern.tw
- Phone: 02-1234-5678

---

**心誠則靈，祈福點燈** 🙏✨

"# temple-lantern" 




