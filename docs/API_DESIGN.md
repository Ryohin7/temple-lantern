# 🔌 API 設計文檔

本文檔定義台灣點燈網的 API 端點設計（規劃中）。

## 🏗️ 基礎架構

### Base URL
```
Development: http://localhost:3000/api
Production: https://temple-lantern.tw/api
```

### 認證方式
使用 Supabase Auth 的 JWT Token

```
Authorization: Bearer <token>
```

## 📋 API 端點

### 1. 廟宇 (Temples)

#### 取得廟宇列表
```http
GET /api/temples
```

**Query Parameters:**
- `city` (optional): 城市篩選
- `search` (optional): 搜尋關鍵字
- `page` (optional): 分頁頁碼
- `limit` (optional): 每頁數量

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "艋舺龍山寺",
      "slug": "lungshan-temple",
      "description": "...",
      "address": "臺北市萬華區廣州街211號",
      "main_god": "觀世音菩薩",
      "banner_image": "url",
      "logo_image": "url",
      "theme_color": "#dc2626"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

#### 取得單一廟宇
```http
GET /api/temples/:slug
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "name": "艋舺龍山寺",
    "slug": "lungshan-temple",
    "description": "...",
    "address": "...",
    "phone": "02-2302-5162",
    "email": "temple@example.com",
    "main_god": "觀世音菩薩",
    "history": "...",
    "banner_image": "url",
    "logo_image": "url",
    "theme_color": "#dc2626"
  }
}
```

#### 建立廟宇（管理員）
```http
POST /api/temples
```

**Request Body:**
```json
{
  "name": "新廟宇名稱",
  "address": "完整地址",
  "main_god": "主祀神明",
  "phone": "02-XXXX-XXXX",
  "email": "temple@example.com",
  "description": "廟宇簡介",
  "theme_color": "#dc2626"
}
```

### 2. 燈種商品 (Lantern Products)

#### 取得廟宇的燈種列表
```http
GET /api/temples/:templeId/lanterns
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "temple_id": "uuid",
      "name": "光明燈",
      "description": "點亮心燈，照耀前程",
      "benefits": "祈求平安順利、前途光明...",
      "price": 1200,
      "duration_months": 12,
      "stock": 100,
      "image": "url",
      "category": "guangming"
    }
  ]
}
```

#### 建立燈種（廟宇管理員）
```http
POST /api/lanterns
```

**Request Body:**
```json
{
  "temple_id": "uuid",
  "name": "光明燈",
  "description": "...",
  "benefits": "...",
  "price": 1200,
  "duration_months": 12,
  "stock": 100,
  "category": "guangming"
}
```

### 3. 訂單 (Orders)

#### 建立訂單
```http
POST /api/orders
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "temple_id": "uuid",
  "items": [
    {
      "lantern_id": "uuid",
      "quantity": 1,
      "believer_name": "王小明",
      "birth_date": "1990-01-01",
      "birth_time": "08:00:00",
      "wish_text": "祈求平安"
    }
  ],
  "customer_info": {
    "name": "王小明",
    "email": "user@example.com",
    "phone": "0912-345-678"
  },
  "payment_method": "credit_card"
}
```

**Response:**
```json
{
  "data": {
    "order_id": "uuid",
    "order_number": "TL20250101001",
    "total_amount": 1200,
    "status": "pending",
    "payment_url": "https://payment.example.com/..."
  }
}
```

#### 取得訂單列表
```http
GET /api/orders
```

**Query Parameters:**
- `user_id` (optional): 用戶 ID
- `temple_id` (optional): 廟宇 ID
- `status` (optional): 訂單狀態

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "order_number": "TL20250101001",
      "total_amount": 1200,
      "status": "paid",
      "payment_status": "paid",
      "created_at": "2025-01-01T10:00:00Z",
      "items": [
        {
          "lantern_name": "光明燈",
          "believer_name": "王小明",
          "quantity": 1
        }
      ]
    }
  ]
}
```

#### 取得單一訂單
```http
GET /api/orders/:orderId
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "order_number": "TL20250101001",
    "user_id": "uuid",
    "temple_id": "uuid",
    "temple_name": "艋舺龍山寺",
    "total_amount": 1200,
    "status": "paid",
    "payment_status": "paid",
    "payment_method": "credit_card",
    "created_at": "2025-01-01T10:00:00Z",
    "items": [
      {
        "id": "uuid",
        "lantern_id": "uuid",
        "lantern_name": "光明燈",
        "quantity": 1,
        "price": 1200,
        "believer_name": "王小明",
        "birth_date": "1990-01-01",
        "wish_text": "祈求平安",
        "certificate_url": "https://..."
      }
    ]
  }
}
```

### 4. 付款 (Payment)

#### 建立付款
```http
POST /api/payment/create
```

**Request Body:**
```json
{
  "order_id": "uuid",
  "payment_method": "credit_card",
  "return_url": "https://temple-lantern.tw/order-success"
}
```

**Response:**
```json
{
  "data": {
    "payment_id": "uuid",
    "payment_url": "https://payment.ecpay.com.tw/...",
    "form_data": {
      // 金流商所需的表單資料
    }
  }
}
```

#### 付款回調
```http
POST /api/payment/callback
```

由金流商呼叫，處理付款結果。

### 5. 祈福留言 (Blessings)

#### 取得廟宇的祈福留言
```http
GET /api/temples/:templeId/blessings
```

**Query Parameters:**
- `page` (optional): 分頁頁碼
- `limit` (optional): 每頁數量

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user_name": "信眾A",
      "message": "祈求平安順利",
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

#### 建立祈福留言
```http
POST /api/blessings
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "temple_id": "uuid",
  "message": "祈求平安順利",
  "is_public": true
}
```

### 6. 用戶 (Users)

#### 取得用戶資料
```http
GET /api/users/me
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "王小明",
    "phone": "0912-345-678",
    "role": "user"
  }
}
```

#### 更新用戶資料
```http
PUT /api/users/me
```

**Request Body:**
```json
{
  "name": "王小明",
  "phone": "0912-345-678",
  "birth_date": "1990-01-01"
}
```

## 🔒 錯誤處理

### 錯誤格式
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "輸入資料格式錯誤",
    "details": {
      "field": "email",
      "issue": "無效的 Email 格式"
    }
  }
}
```

### 常見錯誤碼

| 狀態碼 | 錯誤碼 | 說明 |
|--------|--------|------|
| 400 | INVALID_INPUT | 輸入資料錯誤 |
| 401 | UNAUTHORIZED | 未授權 |
| 403 | FORBIDDEN | 無權限 |
| 404 | NOT_FOUND | 資源不存在 |
| 409 | CONFLICT | 資料衝突 |
| 422 | VALIDATION_ERROR | 資料驗證失敗 |
| 500 | INTERNAL_ERROR | 伺服器錯誤 |

## 📊 Rate Limiting

- 一般 API: 100 requests/分鐘
- 付款相關: 10 requests/分鐘
- 圖片上傳: 20 requests/分鐘

超過限制時回傳 `429 Too Many Requests`

## 🔐 安全性

1. **HTTPS Only**: 所有 API 呼叫必須使用 HTTPS
2. **JWT Token**: 需要認證的端點使用 JWT Token
3. **CORS**: 設定適當的 CORS 政策
4. **Input Validation**: 所有輸入資料需經過驗證
5. **SQL Injection Prevention**: 使用參數化查詢

## 📝 開發注意事項

1. 所有時間格式使用 ISO 8601 (UTC)
2. 金額單位為新台幣（整數）
3. 分頁預設每頁 10 筆
4. API 版本控制：`/api/v1/...`

---

此 API 設計仍在規劃中，實際實作時可能會有調整。



