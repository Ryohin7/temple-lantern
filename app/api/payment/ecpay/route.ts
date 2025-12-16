import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// 綠界金流設定
const ECPAY_CONFIG = {
  MerchantID: process.env.ECPAY_MERCHANT_ID || '3002607',  // 測試商店代號
  HashKey: process.env.ECPAY_HASH_KEY || 'pwFHCqoQZGmho4w6',  // 測試 Hash Key
  HashIV: process.env.ECPAY_HASH_IV || 'EkRm7iFT261dpevs',  // 測試 Hash IV
  PaymentURL: process.env.NODE_ENV === 'production'
    ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
    : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
}

// URL 編碼（符合綠界 .NET UrlEncode 規範）
function dotNetUrlEncode(str: string): string {
  // 先進行標準 URL 編碼
  let encoded = encodeURIComponent(str)

  // .NET UrlEncode 特殊處理
  // 1. 空格編碼為 + 而非 %20
  encoded = encoded.replace(/%20/g, '+')

  // 2. 這些字元在 .NET 中不會被編碼，需要還原
  encoded = encoded.replace(/%21/g, '!')
  encoded = encoded.replace(/%28/g, '(')
  encoded = encoded.replace(/%29/g, ')')
  encoded = encoded.replace(/%2A/g, '*')
  encoded = encoded.replace(/%2D/g, '-')
  encoded = encoded.replace(/%2E/g, '.')
  encoded = encoded.replace(/%5F/g, '_')

  // 3. 小寫十六進位轉大寫（綠界要求）
  encoded = encoded.replace(/%([0-9a-f]{2})/gi, (match, hex) => '%' + hex.toUpperCase())

  return encoded
}

// 清理商品名稱（移除可能造成問題的字元）
function sanitizeItemName(name: string): string {
  return name
    .replace(/[#%&\\'"<>]/g, '') // 移除特殊字元
    .replace(/\s+/g, ' ')        // 多空格變單空格
    .trim()
    .substring(0, 200)           // 限制長度
}

// 產生檢查碼
function generateCheckMacValue(params: Record<string, string>): string {
  // 1. 將參數依照字母順序排序（不區分大小寫）
  const sortedKeys = Object.keys(params).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  )

  // 2. 組合成 key=value& 格式（HashKey 在最前，HashIV 在最後）
  let checkStr = `HashKey=${ECPAY_CONFIG.HashKey}`
  sortedKeys.forEach(key => {
    checkStr += `&${key}=${params[key]}`
  })
  checkStr += `&HashIV=${ECPAY_CONFIG.HashIV}`

  // 3. URL encode（符合 .NET 規範）
  checkStr = dotNetUrlEncode(checkStr)

  // 4. 轉小寫
  checkStr = checkStr.toLowerCase()

  // 5. SHA256 加密
  const hash = crypto.createHash('sha256').update(checkStr).digest('hex')

  // 6. 轉大寫
  return hash.toUpperCase()
}

// 產生訂單編號
function generateTradeNo(): string {
  const now = new Date()
  const timestamp = now.getTime().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TL${timestamp.slice(-10)}${random}`
}

// 產生交易時間
function generateTradeDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, description, items, paymentMethod, returnUrl, clientBackUrl } = body

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      )
    }

    // 金額必須為正整數
    const totalAmount = Math.round(Math.max(1, amount))

    const tradeNo = generateTradeNo()
    const tradeDate = generateTradeDate()

    // 產生商品名稱（清理特殊字元）
    let itemName = '點燈服務'
    if (items && items.length > 0) {
      itemName = items
        .map((item: { name: string; quantity: number }) =>
          `${sanitizeItemName(item.name)} x ${item.quantity}`
        )
        .join('#')
    }
    // 商品名稱限制 400 字元
    itemName = itemName.substring(0, 400)

    // 根據付款方式設定 ChoosePayment 參數
    // 綠界測試商店 3002607 支援的付款方式
    // 注意：測試環境只支援 Credit (信用卡)
    let choosePayment = 'Credit' // 預設信用卡
    if (paymentMethod === 'credit_card') {
      choosePayment = 'Credit'
    } else if (paymentMethod === 'atm') {
      choosePayment = 'ATM'
    } else if (paymentMethod === 'cvs') {
      choosePayment = 'CVS'
    }

    // 取得網站 URL（確保有值）
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // 建立付款參數（注意：這裡的值不需要預先編碼，CheckMacValue 計算時會處理）
    const params: Record<string, string> = {
      MerchantID: ECPAY_CONFIG.MerchantID,
      MerchantTradeNo: tradeNo,
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: String(totalAmount),
      TradeDesc: '台灣點燈網點燈服務',
      ItemName: itemName,
      ReturnURL: returnUrl || `${siteUrl}/api/payment/callback`,
      ClientBackURL: clientBackUrl || `${siteUrl}/order-success?orderId=${orderId}`,
      ChoosePayment: choosePayment,
      EncryptType: '1',
      NeedExtraPaidInfo: 'N',
    }

    // CustomField 是可選的，但如果要使用需要放在計算 CheckMacValue 之前
    if (orderId) {
      params.CustomField1 = orderId
    }

    // 如果是 ATM，需要加上繳費期限
    if (choosePayment === 'ATM') {
      params.ExpireDate = '3' // 3 天內繳費
    }

    // 如果是超商代碼，需要加上繳費期限
    if (choosePayment === 'CVS') {
      params.StoreExpireDate = '10080' // 7 天 (以分鐘計)
      params.Description = '台灣點燈網' // CVS 可能需要 Description
    }

    // 產生檢查碼
    const checkMacValue = generateCheckMacValue(params)
    params.CheckMacValue = checkMacValue

    console.log('ECPay 付款參數:', {
      tradeNo,
      amount: totalAmount,
      itemName,
      choosePayment,
    })

    // 回傳表單資料
    return NextResponse.json({
      success: true,
      paymentUrl: ECPAY_CONFIG.PaymentURL,
      params,
      tradeNo,
    })

  } catch (error) {
    console.error('ECPay API Error:', error)
    return NextResponse.json(
      { error: '金流處理失敗' },
      { status: 500 }
    )
  }
}


