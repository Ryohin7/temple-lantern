# ⚡ 快速開始指南

只需 5 分鐘，立即體驗台灣點燈網！

## 🚀 超快速啟動（3 步驟）

### 步驟 1：安裝依賴

```bash
npm install
```

### 步驟 2：啟動開發伺服器

```bash
npm run dev
```

### 步驟 3：開啟瀏覽器

訪問 **http://localhost:3000** 

🎉 完成！您現在可以瀏覽完整的網站了！

## 📱 功能演示路徑

### 1. 首頁體驗
```
http://localhost:3000
```
- 查看精美的 Hero Section
- 欣賞飄動的燈籠動畫 🏮
- 了解各種燈種

### 2. 瀏覽廟宇
```
http://localhost:3000/temples
```
- 搜尋「龍山寺」或「行天宮」
- 點擊廟宇卡片進入詳細頁
- 查看廟宇資訊與燈種

### 3. 購物體驗
1. 在廟宇頁面選擇燈種
2. 點擊「點燈祈福」
3. 填寫點燈人資訊
4. 前往結帳
5. 觀看訂單成功的煙火特效 🎆

### 4. 廟宇註冊
```
http://localhost:3000/temple-admin/register
```
- 查看廟宇註冊申請表單
- 體驗完整的表單驗證

## 🗄️ 啟用完整功能（可選）

如果您想測試資料庫功能，需要設定 Supabase：

### 1. 建立 Supabase 專案

1. 前往 https://supabase.com
2. 註冊並建立新專案（免費）
3. 等待專案建立完成（約 2 分鐘）

### 2. 執行資料庫 Schema

1. 進入 Supabase Dashboard
2. 點擊左側選單的「SQL Editor」
3. 複製 `supabase/schema.sql` 的內容
4. 貼上並點擊「Run」

### 3. 設定環境變數

建立 `.env.local` 檔案：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_專案_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

在 Supabase Dashboard > Settings > API 可以找到這些資訊。

### 4. 重新啟動

```bash
npm run dev
```

現在您可以測試完整的資料庫功能了！

## 🎨 想要修改設計？

### 改變主題顏色

編輯 `tailwind.config.ts`：

```typescript
temple: {
  red: {
    600: '#dc2626',  // 改成你喜歡的紅色
  },
  gold: {
    500: '#eab308',  // 改成你喜歡的金色
  },
}
```

### 修改首頁文字

編輯 `app/page.tsx`，搜尋文字並修改。

### 新增燈種

編輯 `lib/utils.ts` 的 `LANTERN_CATEGORIES`。

## 📚 進階功能

### 建置生產版本

```bash
npm run build
npm run start
```

### 檢查錯誤

```bash
npm run lint
```

### 查看所有指令

```bash
npm run
```

## 🐛 遇到問題？

### 常見問題快速解決

#### Port 3000 被佔用
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

#### 依賴安裝失敗
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 頁面無法載入
1. 確認終端沒有錯誤訊息
2. 重新整理瀏覽器（Ctrl+F5 / Cmd+Shift+R）
3. 清除瀏覽器快取

## 🎯 下一步做什麼？

### 開發者建議
1. 📖 閱讀 [README.md](README.md) 了解專案架構
2. 🎨 查看 [FEATURES.md](FEATURES.md) 了解所有功能
3. 🚀 閱讀 [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) 準備部署
4. 🤝 查看 [CONTRIBUTING.md](CONTRIBUTING.md) 參與貢獻

### 產品經理建議
1. 🎨 體驗所有頁面與功能
2. 📊 查看 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
3. 💡 思考可以增加的功能
4. 📝 提供回饋與建議

### 測試人員建議
1. 🧪 測試所有購物流程
2. 📱 測試不同裝置（手機、平板、桌面）
3. 🔍 尋找 UI/UX 問題
4. 📋 記錄發現的 Bug

## 💬 需要協助？

- 📧 Email: contact@temple-lantern.tw
- 📖 查看詳細文檔
- 🐛 提交 Issue

## ⭐ 覺得不錯？

如果您喜歡這個專案：
- ⭐ 給個 Star
- 🔄 分享給朋友
- 🤝 參與貢獻

---

**現在開始探索吧！** 🏮✨

```bash
npm run dev
```

