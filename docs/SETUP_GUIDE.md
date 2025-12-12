# 🏮 台灣點燈網 - 設定指南

## 一、綠界金流 (ECPay) 設定

### 步驟 1：申請綠界帳號

1. 前往 [綠界官網](https://www.ecpay.com.tw/) 點擊「商家申請」
2. 填寫申請資料，選擇「一般商家」
3. 上傳營業登記證或公司登記資料
4. 等待審核（約 3-5 個工作天）

### 步驟 2：取得測試環境憑證

在正式申請通過前，可以使用測試環境：

```env
# 測試環境（已預設在程式中）
ECPAY_MERCHANT_ID=3002607
ECPAY_HASH_KEY=pwFHCqoQZGmho4w6
ECPAY_HASH_IV=EkRm7iFT261dpevs
```

### 步驟 3：正式環境設定

申請通過後，登入綠界商家後台取得正式憑證：

1. 登入 [綠界商家後台](https://vendor.ecpay.com.tw/)
2. 進入「系統管理」→「系統串接設定」
3. 複製 MerchantID、HashKey、HashIV

在 `.env.local` 設定：

```env
ECPAY_MERCHANT_ID=你的商店代號
ECPAY_HASH_KEY=你的HashKey
ECPAY_HASH_IV=你的HashIV
```

### 步驟 4：設定付款完成網址

在綠界後台設定：
- **付款完成通知網址**：`https://你的網域/api/payment/callback`
- **付款完成返回網址**：`https://你的網域/order-success`

---

## 二、Google OAuth 登入設定

### 步驟 1：建立 Google Cloud 專案

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案，名稱如「temple-lantern」
3. 在左側選單選擇「API 和服務」→「OAuth 同意畫面」

### 步驟 2：設定 OAuth 同意畫面

1. 選擇「外部」使用者類型
2. 填寫應用程式資訊：
   - 應用程式名稱：台灣點燈網
   - 使用者支援電子郵件：你的 Email
   - 開發人員聯絡資訊：你的 Email
3. 範圍：選擇 `email`、`profile`、`openid`
4. 測試使用者：新增你的 Email

### 步驟 3：建立 OAuth 憑證

1. 進入「API 和服務」→「憑證」
2. 點擊「建立憑證」→「OAuth 用戶端 ID」
3. 應用程式類型：網頁應用程式
4. 設定已授權的重新導向 URI：
   - 開發環境：`http://localhost:3000/api/auth/callback/google`
   - 正式環境：`https://你的網域/api/auth/callback/google`

### 步驟 4：設定環境變數

複製 Client ID 和 Client Secret，在 `.env.local` 新增：

```env
GOOGLE_CLIENT_ID=你的ClientID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=你的ClientSecret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=隨機生成的32字元字串
```

生成 NEXTAUTH_SECRET：
```bash
openssl rand -base64 32
```

---

## 三、Supabase 資料庫設定

### 步驟 1：建立 Supabase 專案

1. 前往 [Supabase](https://supabase.com/) 並登入
2. 建立新專案
3. 記錄 Project URL 和 anon key

### 步驟 2：設定資料庫表格

在 Supabase SQL Editor 執行以下 SQL：

```sql
-- 用戶表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  avatar_url TEXT,
  provider VARCHAR(50) DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 廟宇表
CREATE TABLE temples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  city VARCHAR(50),
  district VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(255),
  main_god VARCHAR(100),
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 燈種表
CREATE TABLE lantern_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  original_price INTEGER,
  discount_start TIMESTAMP WITH TIME ZONE,
  discount_end TIMESTAMP WITH TIME ZONE,
  duration VARCHAR(50),
  image_url TEXT,
  available_quantity INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 訂單表
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_no VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id),
  temple_id UUID REFERENCES temples(id),
  total_amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  ecpay_trade_no VARCHAR(50),
  customer_name VARCHAR(100),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 訂單項目表
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  lantern_id UUID REFERENCES lantern_products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price INTEGER NOT NULL,
  believer_name VARCHAR(100),
  believer_birthday DATE,
  believer_lunar_birthday VARCHAR(50),
  believer_address TEXT,
  blessing_message TEXT,
  lighting_status VARCHAR(20) DEFAULT 'pending',
  lighting_date TIMESTAMP WITH TIME ZONE,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 祈福留言表
CREATE TABLE blessings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  temple_id UUID REFERENCES temples(id),
  message TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 廣告 Banner 表
CREATE TABLE banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  temple_id UUID REFERENCES temples(id),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 法會活動表
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  event_date DATE,
  price INTEGER,
  original_price INTEGER,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 開啟 Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE temples ENABLE ROW LEVEL SECURITY;
ALTER TABLE lantern_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blessings ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
```

### 步驟 3：設定環境變數

在 `.env.local` 設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的專案.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon_key
```

---

## 四、Vercel 部署設定

### 步驟 1：連結 GitHub

1. 前往 [Vercel](https://vercel.com/) 並登入
2. 點擊「Import Project」
3. 選擇你的 GitHub 倉庫

### 步驟 2：設定環境變數

在 Vercel 專案設定中新增以下環境變數：

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=https://你的vercel網域

ECPAY_MERCHANT_ID=...
ECPAY_HASH_KEY=...
ECPAY_HASH_IV=...

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=https://你的vercel網域
NEXTAUTH_SECRET=...
```

### 步驟 3：部署

點擊「Deploy」，Vercel 會自動從 GitHub 拉取程式碼並部署。

---

## 五、上線成本估算

### 固定成本（每月）

| 項目 | 成本 | 說明 |
|------|------|------|
| Vercel | $0 - $20 | Hobby 免費，Pro $20/月 |
| Supabase | $0 - $25 | Free tier 免費，Pro $25/月 |
| 網域 | ~$500/年 | .tw 網域約 $500-1000/年 |

### 變動成本（依交易量）

| 項目 | 費率 | 說明 |
|------|------|------|
| 綠界金流 | 2.75% | 信用卡手續費 |
| 綠界金流 | 1% | ATM/超商手續費 |

### 建議抽成比例

- **平台抽成：5%** - 覆蓋基本營運成本
- **實際收益**：5% - 2.75% = 2.25%（扣除金流成本）

### 損益平衡計算

假設每月固定成本 $2,000（Vercel + Supabase + 網域分攤）：
- 損益平衡營業額 = $2,000 ÷ 2.25% = **$88,889/月**
- 以平均訂單 $1,500 計算 = **約 60 筆訂單/月**

---

## 六、完整環境變數範例

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...

# Site
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# ECPay 綠界金流
ECPAY_MERCHANT_ID=your_merchant_id
ECPAY_HASH_KEY=your_hash_key
ECPAY_HASH_IV=your_hash_iv

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_random_secret_32_chars
```

---

如有任何問題，請參考各服務的官方文件：
- [綠界技術文件](https://www.ecpay.com.tw/CascadeFAQ/CascadeFAQ_Qa?nID=1145)
- [Google OAuth 文件](https://developers.google.com/identity/protocols/oauth2)
- [Supabase 文件](https://supabase.com/docs)
- [Vercel 文件](https://vercel.com/docs)




