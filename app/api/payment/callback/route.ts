import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// 綠界金流設定
const ECPAY_CONFIG = {
  MerchantID: process.env.ECPAY_MERCHANT_ID || '3002607',
  HashKey: process.env.ECPAY_HASH_KEY || 'pwFHCqoQZGmho4w6',
  HashIV: process.env.ECPAY_HASH_IV || 'EkRm7iFT261dpevs',
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

// 驗證檢查碼
function verifyCheckMacValue(params: Record<string, string>): boolean {
  const receivedCheckMacValue = params.CheckMacValue
  
  // 移除 CheckMacValue 後重新計算
  const paramsWithoutCheck = { ...params }
  delete paramsWithoutCheck.CheckMacValue
  
  // 依照字母順序排序
  const sortedKeys = Object.keys(paramsWithoutCheck).sort()
  
  // 組合成 key=value& 格式
  let checkStr = `HashKey=${ECPAY_CONFIG.HashKey}`
  sortedKeys.forEach(key => {
    checkStr += `&${key}=${paramsWithoutCheck[key]}`
  })
  checkStr += `&HashIV=${ECPAY_CONFIG.HashIV}`
  
  // URL encode
  checkStr = encodeURIComponentECPay(checkStr)
  
  // 轉小寫
  checkStr = checkStr.toLowerCase()
  
  // SHA256 加密
  const hash = crypto.createHash('sha256').update(checkStr).digest('hex')
  
  // 轉大寫比對
  return hash.toUpperCase() === receivedCheckMacValue
}

export async function POST(request: NextRequest) {
  try {
    // 解析 form data
    const formData = await request.formData()
    const params: Record<string, string> = {}
    
    formData.forEach((value, key) => {
      params[key] = value.toString()
    })

    console.log('ECPay Callback received:', params)

    // 驗證檢查碼
    if (!verifyCheckMacValue(params)) {
      console.error('CheckMacValue 驗證失敗')
      return new NextResponse('0|CheckMacValue Fail', { status: 200 })
    }

    // 取得付款結果
    const {
      MerchantTradeNo,
      RtnCode,
      RtnMsg,
      TradeNo,
      TradeAmt,
      PaymentDate,
      PaymentType,
      CustomField1, // 我們的訂單編號
    } = params

    // RtnCode 為 1 表示付款成功
    if (RtnCode === '1') {
      console.log(`訂單 ${CustomField1} 付款成功`)
      
      // TODO: 更新資料庫訂單狀態
      // await updateOrderStatus(CustomField1, 'paid', {
      //   ecpayTradeNo: TradeNo,
      //   merchantTradeNo: MerchantTradeNo,
      //   paymentDate: PaymentDate,
      //   paymentType: PaymentType,
      //   amount: TradeAmt,
      // })

      // TODO: 發送通知給用戶
      // await sendPaymentSuccessNotification(CustomField1)

      // TODO: 發送通知給廟方
      // await notifyTemple(CustomField1)

    } else {
      console.log(`訂單 ${CustomField1} 付款失敗: ${RtnMsg}`)
      
      // TODO: 更新訂單狀態為付款失敗
      // await updateOrderStatus(CustomField1, 'payment_failed', {
      //   errorMessage: RtnMsg,
      // })
    }

    // 回傳 1|OK 表示收到通知
    return new NextResponse('1|OK', { status: 200 })

  } catch (error) {
    console.error('ECPay Callback Error:', error)
    return new NextResponse('0|Error', { status: 200 })
  }
}

// 綠界也會用 GET 方式測試連線
export async function GET() {
  return new NextResponse('ECPay Callback Endpoint OK', { status: 200 })
}


