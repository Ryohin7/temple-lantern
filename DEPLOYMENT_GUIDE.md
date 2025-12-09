# 🚀 部署指南

本文檔說明如何將台灣點燈網部署到生產環境。

## 📋 前置作業

### 1. Supabase 專案設定

1. 前往 [Supabase](https://supabase.com) 建立新專案
2. 執行資料庫 Schema

進入 Supabase Dashboard > SQL Editor，執行 `supabase/schema.sql` 中的所有 SQL 指令。

3. 取得 API 金鑰

在 Settings > API 中可以找到：
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. 環境變數設定

建立 `.env.local` 檔案（本地開發）或在部署平台設定環境變數：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🔧 Vercel 部署（推薦）

### 方法一：透過 GitHub 自動部署

1. 將程式碼推送到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/temple-lantern.git
git push -u origin main
```

2. 在 Vercel 導入專案

- 前往 [Vercel Dashboard](https://vercel.com/dashboard)
- 點擊 "Add New Project"
- 選擇你的 GitHub repository
- 設定環境變數
- 點擊 "Deploy"

3. 設定環境變數

在 Vercel 專案設定中加入：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### 方法二：透過 Vercel CLI

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel

# 部署到生產環境
vercel --prod
```

## 🐳 Docker 部署

### 1. 建立 Dockerfile

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. 建立 docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped
```

### 3. 部署

```bash
# 建置映像檔
docker build -t temple-lantern .

# 執行容器
docker run -p 3000:3000 --env-file .env.local temple-lantern

# 或使用 docker-compose
docker-compose up -d
```

## 🖥️ VPS 部署（Ubuntu/CentOS）

### 1. 安裝 Node.js

```bash
# 安裝 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 確認版本
node --version
npm --version
```

### 2. 安裝 PM2

```bash
sudo npm install -g pm2
```

### 3. 部署應用程式

```bash
# Clone 專案
git clone https://github.com/your-username/temple-lantern.git
cd temple-lantern

# 安裝依賴
npm install

# 建置
npm run build

# 使用 PM2 啟動
pm2 start npm --name "temple-lantern" -- start

# 設定開機自動啟動
pm2 startup
pm2 save
```

### 4. 設定 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. 設定 SSL（使用 Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📊 效能優化

### 1. 啟用快取

在 `next.config.js` 中設定：

```javascript
module.exports = {
  // ...其他設定
  headers: async () => [
    {
      source: '/:all*(svg|jpg|png|webp)',
      locale: false,
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        }
      ],
    },
  ],
}
```

### 2. 圖片優化

使用 Next.js Image 組件並設定合適的尺寸：

```tsx
<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="描述"
  priority={false} // 非首屏圖片設為 false
/>
```

### 3. 使用 CDN

將靜態資源部署到 CDN（如 Cloudflare）以加速載入。

## 🔒 安全性檢查清單

- [ ] 設定正確的 CORS 政策
- [ ] 啟用 Supabase Row Level Security (RLS)
- [ ] 使用環境變數儲存敏感資訊
- [ ] 設定 SSL/TLS 憑證
- [ ] 定期更新依賴套件
- [ ] 實施 Rate Limiting
- [ ] 設定適當的 Content Security Policy

## 🔍 監控與日誌

### 使用 Vercel Analytics

在 Vercel 專案設定中啟用 Analytics。

### 使用 Sentry 錯誤追蹤

```bash
npm install @sentry/nextjs
```

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  // Next.js config
  {},
  // Sentry config
  {
    silent: true,
    org: "your-org",
    project: "temple-lantern",
  }
);
```

## 📝 部署後檢查

- [ ] 所有頁面都能正常載入
- [ ] 圖片正確顯示
- [ ] 表單提交功能正常
- [ ] 資料庫連線正常
- [ ] SSL 憑證有效
- [ ] 效能測試通過
- [ ] SEO 標籤正確設定

## 🆘 常見問題

### 建置失敗

檢查 Node.js 版本是否符合要求（建議 18.x 以上）。

### 環境變數未載入

確保環境變數名稱以 `NEXT_PUBLIC_` 開頭（客戶端變數）。

### 圖片載入失敗

檢查 `next.config.js` 中的 `images.domains` 設定。

## 📞 需要協助？

如有部署相關問題，請聯繫：
- Email: contact@temple-lantern.tw
- GitHub Issues: https://github.com/your-org/temple-lantern/issues

---

祝您部署順利！🙏✨

