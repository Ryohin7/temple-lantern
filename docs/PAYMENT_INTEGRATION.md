# 💳 金流整合指南

本文檔說明如何整合台灣常用的金流服務商。

## 🏦 支援的金流商

### 1. 綠界科技 (ECPay)
- 市佔率高，台灣最受歡迎
- 支援信用卡、ATM、超商代碼等
- 介接相對簡單

### 2. 藍新金流 (NewebPay)
- 同樣是主流金流商
- 功能完整，費率合理
- 提供完整的技術文件

## 📋 前置作業

### 申請金流商帳號

#### 綠界科技
1. 前往 [綠界科技](https://www.ecpay.com.tw/)
2. 註冊商店帳號
3. 完成實名認證
4. 取得以下資訊：
   - 商店代號 (MerchantID)
   - HashKey
   - HashIV

#### 藍新金流
1. 前往 [藍新金流](https://www.newebpay.com/)
2. 註冊商店帳號
3. 完成審核
4. 取得金鑰資訊

### 測試環境

兩家金流商都提供測試環境，建議先在測試環境完成開發。

## 🔧 綠界科技整合

### 1. 安裝依賴

```bash
npm install crypto
```

### 2. 建立綠界服務

建立 `lib/payment/ecpay.ts`：

```typescript
import crypto from 'crypto'

interface ECPayConfig {
  merchantID: string
  hashKey: string
  hashIV: string
  returnURL: string
  orderResultURL: string
}

export class ECPayService {
  private config: ECPayConfig
  private apiUrl: string

  constructor(isProduction = false) {
    this.config = {
      merchantID: process.env.ECPAY_MERCHANT_ID!,
      hashKey: process.env.ECPAY_HASH_KEY!,
      hashIV: process.env.ECPAY_HASH_IV!,
      returnURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/ecpay/return`,
      orderResultURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/ecpay/callback`,
    }

    this.apiUrl = isProduction
      ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
      : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
  }

  /**
   * 產生交易資料
   */
  createTransaction(params: {
    orderId: string
    amount: number
    description: string
    email: string
  }) {
    const data = {
      MerchantID: this.config.merchantID,
      MerchantTradeNo: params.orderId,
      MerchantTradeDate: this.getTradeDate(),
      PaymentType: 'aio',
      TotalAmount: params.amount.toString(),
      TradeDesc: params.description,
      ItemName: params.description,
      ReturnURL: this.config.returnURL,
      OrderResultURL: this.config.orderResultURL,
      ChoosePayment: 'ALL',
      EncryptType: 1,
    }

    const checkMacValue = this.generateCheckMacValue(data)

    return {
      ...data,
      CheckMacValue: checkMacValue,
      apiUrl: this.apiUrl,
    }
  }

  /**
   * 產生檢查碼
   */
  private generateCheckMacValue(data: Record<string, any>): string {
    // 1. 參數按照字母順序排序
    const sortedKeys = Object.keys(data).sort()
    
    // 2. 組合字串
    let checkStr = `HashKey=${this.config.hashKey}`
    sortedKeys.forEach(key => {
      checkStr += `&${key}=${data[key]}`
    })
    checkStr += `&HashIV=${this.config.hashIV}`

    // 3. URL encode
    checkStr = encodeURIComponent(checkStr).toLowerCase()
    
    // 4. 特殊字元處理
    checkStr = checkStr
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%20/g, '+')

    // 5. MD5 hash
    return crypto
      .createHash('md5')
      .update(checkStr)
      .digest('hex')
      .toUpperCase()
  }

  /**
   * 驗證回傳資料
   */
  verifyCallback(data: Record<string, any>): boolean {
    const receivedCheckMacValue = data.CheckMacValue
    delete data.CheckMacValue

    const calculatedCheckMacValue = this.generateCheckMacValue(data)
    
    return receivedCheckMacValue === calculatedCheckMacValue
  }

  /**
   * 取得交易日期格式
   */
  private getTradeDate(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  }
}
```

### 3. 建立 API 端點

建立 `app/api/payment/create/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ECPayService } from '@/lib/payment/ecpay'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, description, email } = await request.json()

    // 驗證訂單
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // 建立綠界交易
    const ecpay = new ECPayService(false) // false = 測試環境
    const transaction = ecpay.createTransaction({
      orderId: order.order_number,
      amount: order.total_amount,
      description: `台灣點燈網 - ${description}`,
      email,
    })

    return NextResponse.json({
      success: true,
      data: transaction,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
```

### 4. 處理付款回傳

建立 `app/api/payment/ecpay/callback/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { ECPayService } from '@/lib/payment/ecpay'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const data: Record<string, any> = {}
    
    formData.forEach((value, key) => {
      data[key] = value
    })

    // 驗證檢查碼
    const ecpay = new ECPayService()
    const isValid = ecpay.verifyCallback(data)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // 更新訂單狀態
    const { RtnCode, MerchantTradeNo, TradeAmt } = data

    if (RtnCode === '1') {
      // 付款成功
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'paid',
          payment_info: data,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', MerchantTradeNo)

      // 發送通知 email
      // TODO: 實作 email 通知

      return NextResponse.json('1|OK')
    } else {
      // 付款失敗
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_info: data,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', MerchantTradeNo)

      return NextResponse.json('0|Error')
    }
  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```

### 5. 前端整合

修改 `app/checkout/page.tsx`：

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setProcessing(true)

  try {
    // 建立訂單
    const orderResponse = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items,
        customer_info: customerInfo,
        payment_method: paymentMethod,
      }),
    })

    const { data: order } = await orderResponse.json()

    // 建立付款
    const paymentResponse = await fetch('/api/payment/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: order.id,
        amount: order.total_amount,
        description: '點燈祈福',
        email: customerInfo.email,
      }),
    })

    const { data: payment } = await paymentResponse.json()

    // 導向綠界付款頁面
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = payment.apiUrl

    Object.keys(payment).forEach(key => {
      if (key !== 'apiUrl') {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = payment[key]
        form.appendChild(input)
      }
    })

    document.body.appendChild(form)
    form.submit()
  } catch (error) {
    console.error('Checkout error:', error)
    alert('結帳發生錯誤，請稍後再試')
  } finally {
    setProcessing(false)
  }
}
```

## 🧪 測試流程

### 測試信用卡號

綠界測試環境提供的測試卡號：
```
卡號：4311-9522-2222-2222
有效期：任意未來日期
CVV：任意三碼
```

### 測試步驟

1. 啟動開發伺服器
2. 完成購物流程
3. 進入結帳頁面
4. 選擇付款方式
5. 導向綠界測試頁面
6. 使用測試卡號完成付款
7. 確認回傳結果
8. 檢查訂單狀態更新

## 🔒 安全性考量

### 重要提醒

1. **絕不在前端暴露金鑰**
   - HashKey 和 HashIV 必須在伺服器端使用
   - 使用環境變數儲存敏感資訊

2. **驗證回傳資料**
   - 必須驗證 CheckMacValue
   - 檢查訂單金額是否一致
   - 確認訂單狀態未被重複更新

3. **使用 HTTPS**
   - 生產環境必須使用 SSL 憑證
   - 確保資料傳輸加密

4. **記錄所有交易**
   - 保存完整的付款資訊
   - 記錄時間戳與狀態變更

## 📊 訂單狀態流程

```
pending (待付款)
    ↓
paid (已付款)
    ↓
processing (處理中)
    ↓
completed (已完成)
```

失敗流程：
```
pending → failed (付款失敗)
paid → refunded (已退款)
```

## 🐛 常見問題

### Q: CheckMacValue 驗證失敗
- 確認 HashKey 和 HashIV 正確
- 檢查參數排序
- 確認 URL encode 處理正確

### Q: 付款後沒有回傳
- 檢查 callback URL 是否可從外部訪問
- 確認防火牆設定
- 查看伺服器日誌

### Q: 金額不一致
- 確認單位為整數（元）
- 檢查小數點處理

## 📚 參考資源

- [綠界技術文件](https://www.ecpay.com.tw/Service/API_Dwnld)
- [藍新技術文件](https://www.newebpay.com/website/Page/content/download_api)

## 🔜 TODO

- [ ] 實作退款功能
- [ ] 增加定期定額付款
- [ ] 整合 LINE Pay
- [ ] 整合街口支付
- [ ] 完整的錯誤處理
- [ ] 交易記錄查詢
- [ ] 對帳功能

---

**注意**：金流整合需要實際的商家帳號和完整測試，建議在測試環境完成所有測試後再上線。






