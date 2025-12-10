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

// URL 編碼（符合綠界規範）
function encodeURIComponentECPay(str: string): string {
  return encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/%2D/g, '-')
    .replace(/%5F/g, '_')
    .replace(/%2E/g, '.')
    .replace(/%21/g, '!')
    .replace(/%2A/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
}

// 產生檢查碼
function generateCheckMacValue(params: Record<string, string>): string {
  // 1. 將參數依照字母順序排序
  const sortedKeys = Object.keys(params).sort()
  
  // 2. 組合成 key=value& 格式
  let checkStr = `HashKey=${ECPAY_CONFIG.HashKey}`
  sortedKeys.forEach(key => {
    checkStr += `&${key}=${params[key]}`
  })
  checkStr += `&HashIV=${ECPAY_CONFIG.HashIV}`
  
  // 3. URL encode
  checkStr = encodeURIComponentECPay(checkStr)
  
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
    const { orderId, amount, description, items, returnUrl, clientBackUrl } = body

    if (!orderId || !amount || !description) {
      return NextResponse.json(
        { error: '缺少必要參數' },
        { status: 400 }
      )
    }

    const tradeNo = generateTradeNo()
    const tradeDate = generateTradeDate()
    
    // 產生商品名稱
    const itemName = items 
      ? items.map((item: { name: string; quantity: number }) => 
          `${item.name} x ${item.quantity}`
        ).join('#')
      : description

    // 建立付款參數
    const params: Record<string, string> = {
      MerchantID: ECPAY_CONFIG.MerchantID,
      MerchantTradeNo: tradeNo,
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: String(Math.round(amount)),
      TradeDesc: encodeURIComponent('台灣點燈網點燈服務'),
      ItemName: itemName,
      ReturnURL: returnUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/callback`,
      ClientBackURL: clientBackUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?orderId=${orderId}`,
      ChoosePayment: 'ALL',
      EncryptType: '1',
      CustomField1: orderId, // 儲存我們的訂單編號
    }

    // 產生檢查碼
    const checkMacValue = generateCheckMacValue(params)
    params.CheckMacValue = checkMacValue

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

