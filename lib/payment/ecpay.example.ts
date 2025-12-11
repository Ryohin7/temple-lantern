/**
 * 綠界金流整合範例
 * 
 * 此檔案為範例程式碼，實際使用時需要：
 * 1. 申請綠界商店帳號
 * 2. 取得 MerchantID, HashKey, HashIV
 * 3. 在 .env.local 設定環境變數
 * 4. 測試完成後再部署到生產環境
 */

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
      merchantID: process.env.ECPAY_MERCHANT_ID || '',
      hashKey: process.env.ECPAY_HASH_KEY || '',
      hashIV: process.env.ECPAY_HASH_IV || '',
      returnURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/ecpay/return`,
      orderResultURL: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payment/ecpay/callback`,
    }

    this.apiUrl = isProduction
      ? 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5'
      : 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
  }

  /**
   * 建立交易
   */
  createTransaction(params: {
    orderId: string
    amount: number
    description: string
    email?: string
  }) {
    const tradeDate = this.getTradeDate()
    
    const data = {
      MerchantID: this.config.merchantID,
      MerchantTradeNo: params.orderId,
      MerchantTradeDate: tradeDate,
      PaymentType: 'aio',
      TotalAmount: params.amount.toString(),
      TradeDesc: params.description,
      ItemName: params.description,
      ReturnURL: this.config.returnURL,
      OrderResultURL: this.config.orderResultURL,
      ChoosePayment: 'ALL', // ALL=全部, Credit=信用卡, ATM=ATM
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
   * 產生檢查碼（CheckMacValue）
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

    // 3. URL encode (注意：綠界有特殊的 encode 規則)
    checkStr = encodeURIComponent(checkStr).toLowerCase()
    
    // 4. 特殊字元處理（綠界規範）
    checkStr = checkStr
      .replace(/%2d/g, '-')
      .replace(/%5f/g, '_')
      .replace(/%2e/g, '.')
      .replace(/%21/g, '!')
      .replace(/%2a/g, '*')
      .replace(/%28/g, '(')
      .replace(/%29/g, ')')
      .replace(/%20/g, '+')

    // 5. SHA256 或 MD5 hash（依 EncryptType 決定）
    return crypto
      .createHash('md5')
      .update(checkStr)
      .digest('hex')
      .toUpperCase()
  }

  /**
   * 驗證綠界回傳的資料
   */
  verifyCallback(data: Record<string, any>): boolean {
    const receivedCheckMacValue = data.CheckMacValue
    delete data.CheckMacValue

    const calculatedCheckMacValue = this.generateCheckMacValue(data)
    
    return receivedCheckMacValue === calculatedCheckMacValue
  }

  /**
   * 取得交易日期格式（yyyy/MM/dd HH:mm:ss）
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

  /**
   * 解析付款結果
   */
  parsePaymentResult(data: Record<string, any>) {
    return {
      isSuccess: data.RtnCode === '1',
      tradeNo: data.TradeNo,
      merchantTradeNo: data.MerchantTradeNo,
      amount: parseInt(data.TradeAmt),
      paymentDate: data.PaymentDate,
      paymentType: data.PaymentType,
      message: data.RtnMsg,
    }
  }
}

// 使用範例
export function exampleUsage() {
  // 初始化服務（測試環境）
  const ecpay = new ECPayService(false)

  // 建立交易
  const transaction = ecpay.createTransaction({
    orderId: 'TL20250101001',
    amount: 1200,
    description: '光明燈 x 1',
    email: 'user@example.com',
  })

  console.log('Transaction data:', transaction)

  // 前端需要將這些資料以 POST form 方式送到 apiUrl
  // 範例：
  // <form method="POST" action={transaction.apiUrl}>
  //   <input type="hidden" name="MerchantID" value={transaction.MerchantID} />
  //   <input type="hidden" name="MerchantTradeNo" value={transaction.MerchantTradeNo} />
  //   ...
  //   <button type="submit">前往付款</button>
  // </form>
}



