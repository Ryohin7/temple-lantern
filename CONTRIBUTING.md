# 🤝 貢獻指南

感謝您對台灣點燈網專案的興趣！我們歡迎各種形式的貢獻。

## 📋 貢獻方式

您可以透過以下方式為專案做出貢獻：

### 1. 回報問題 (Bug Reports)
- 使用 GitHub Issues 回報錯誤
- 請提供詳細的重現步驟
- 包含您的環境資訊（瀏覽器、作業系統等）
- 如可能，請附上截圖或錯誤訊息

### 2. 功能建議 (Feature Requests)
- 在 Issues 中提出新功能想法
- 說明為什麼需要這個功能
- 描述期望的行為

### 3. 提交程式碼 (Pull Requests)
- Fork 專案
- 建立新的 branch
- 提交您的修改
- 發起 Pull Request

### 4. 改善文檔
- 修正錯字或不清楚的說明
- 增加範例程式碼
- 翻譯文檔

## 🚀 開發流程

### 1. Fork 專案

點擊 GitHub 頁面右上角的 "Fork" 按鈕。

### 2. Clone 到本地

```bash
git clone https://github.com/your-username/temple-lantern.git
cd temple-lantern
```

### 3. 建立新分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/bug-description
```

### 4. 安裝依賴

```bash
npm install
```

### 5. 開發

```bash
npm run dev
```

### 6. 提交變更

```bash
git add .
git commit -m "feat: add your feature description"
```

#### Commit Message 規範

我們使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

- `feat`: 新功能
- `fix`: 錯誤修復
- `docs`: 文檔更新
- `style`: 程式碼格式調整
- `refactor`: 程式碼重構
- `test`: 測試相關
- `chore`: 其他雜項

範例：
```
feat: add blessing message board
fix: resolve cart quantity update issue
docs: update deployment guide
```

### 7. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

### 8. 建立 Pull Request

1. 前往您 Fork 的 repository
2. 點擊 "New Pull Request"
3. 填寫 PR 標題與描述
4. 等待審核

## 📝 程式碼風格

### TypeScript / JavaScript

- 使用 TypeScript
- 遵循 ESLint 規則
- 使用有意義的變數名稱
- 加上適當的註解

### CSS / Tailwind

- 優先使用 Tailwind CSS 類別
- 遵循專案的配色系統
- 保持響應式設計

### 組件規範

```tsx
// ✅ 良好範例
interface MyComponentProps {
  title: string
  onAction: () => void
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  )
}

// ❌ 避免
export function MyComponent(props) {
  return <div style={{padding: '16px'}}>{props.title}</div>
}
```

## 🧪 測試

在提交 PR 前，請確保：

- [ ] 程式碼能正常編譯
- [ ] 沒有 TypeScript 錯誤
- [ ] 沒有 ESLint 警告
- [ ] 在不同裝置上測試（桌面、平板、手機）
- [ ] 測試相關功能是否正常運作

```bash
# 檢查類型錯誤
npm run type-check

# 檢查 Lint
npm run lint

# 建置測試
npm run build
```

## 📂 專案結構

```
temple-lantern/
├── app/              # Next.js 頁面與路由
├── components/       # React 組件
│   ├── temple/      # 廟宇相關組件
│   ├── layout/      # 佈局組件
│   └── ui/          # 基礎 UI 組件
├── lib/             # 工具函式與設定
├── public/          # 靜態資源
└── supabase/        # 資料庫相關
```

## 🎨 設計原則

### 台灣廟宇文化
- 保持傳統廟宇的莊嚴感
- 使用合適的配色（紅、金、橘）
- 加入適當的文化元素（燈籠、祥雲、龍鳳等）

### 使用者體驗
- 簡單直覺的操作流程
- 清楚的視覺回饋
- 快速的載入速度
- 無障礙設計

### 技術品質
- 乾淨易讀的程式碼
- 適當的錯誤處理
- 效能優化
- 安全性考量

## 🐛 回報問題

### Bug Report Template

```markdown
**描述問題**
清楚簡潔地描述問題。

**重現步驟**
1. 前往 '...'
2. 點擊 '...'
3. 捲動至 '...'
4. 看到錯誤

**預期行為**
描述您預期應該發生什麼。

**實際行為**
描述實際發生了什麼。

**截圖**
如果可以，請附上截圖。

**環境資訊**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]
```

## 💡 功能建議

### Feature Request Template

```markdown
**功能描述**
清楚簡潔地描述您想要的功能。

**為什麼需要這個功能**
說明這個功能可以解決什麼問題。

**期望的解決方案**
描述您希望如何實現這個功能。

**替代方案**
是否有其他可行的替代方案。

**補充資訊**
任何其他相關資訊或截圖。
```

## 📞 聯絡方式

如有任何問題，歡迎透過以下方式聯繫：

- GitHub Issues: [專案 Issues 頁面]
- Email: contact@temple-lantern.tw

## 📜 授權

提交貢獻即表示您同意您的貢獻將以 MIT License 授權。

## 🙏 致謝

感謝所有為專案做出貢獻的開發者！

---

再次感謝您的貢獻！🏮✨





