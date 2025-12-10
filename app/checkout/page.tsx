'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, AlertCircle, Store, Banknote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { FireworkEffect } from '@/components/temple/TempleDecoration'

export default function CheckoutPage() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [showFireworks, setShowFireworks] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  const [mounted, setMounted] = useState(false)
  const [ecpayParams, setEcpayParams] = useState<Record<string, string> | null>(null)
  const [ecpayUrl, setEcpayUrl] = useState<string>('')
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })

  // 確保只在客戶端執行
  useEffect(() => {
    setMounted(true)
    // 客戶端 hydration
    useCartStore.persist.rehydrate()
  }, [])

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items.length, router])

  // 當 ecpayParams 設定後自動提交表單
  useEffect(() => {
    if (ecpayParams && formRef.current) {
      formRef.current.submit()
    }
  }, [ecpayParams])

  // 伺服器端渲染時顯示載入狀態
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl animate-bounce">🏮</div>
          <p className="text-gray-600 mt-4">載入中...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('請填寫所有必填欄位')
      return
    }

    setProcessing(true)

    try {
      // 建立訂單編號
      const orderId = `ORD-${Date.now()}`
      
      // 準備訂單商品資訊
      const orderItems = items.map(item => ({
        name: `${item.templeName}-${item.lanternName}`,
        quantity: item.quantity,
      }))

      // 呼叫綠界金流 API
      const response = await fetch('/api/payment/ecpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount: getTotalPrice(),
          description: `台灣點燈網點燈服務`,
          items: orderItems,
          customerInfo,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // 設定綠界表單參數，會自動提交
        setEcpayUrl(data.paymentUrl)
        setEcpayParams(data.params)
      } else {
        throw new Error(data.error || '金流處理失敗')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('付款處理失敗，請稍後再試')
      setProcessing(false)
    }
  }

  // 模擬付款（測試用）
  const handleTestPayment = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setShowFireworks(true)
      
      setTimeout(() => {
        clearCart()
        router.push('/order-success')
      }, 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 to-white py-12">
      {showFireworks && <FireworkEffect trigger={true} />}
      
      {/* 綠界金流表單（隱藏） */}
      {ecpayParams && (
        <form ref={formRef} method="POST" action={ecpayUrl} style={{ display: 'none' }}>
          {Object.entries(ecpayParams).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-temple font-bold text-temple-red-800 mb-4 flex items-center justify-center gap-3">
            <CreditCard className="w-12 h-12" />
            結帳付款
          </h1>
          <p className="text-gray-600 text-lg">
            最後一步，完成付款即可點燈祈福
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-temple-gold-300 shadow-lg">
                <CardHeader className="bg-temple-gold-50">
                  <CardTitle className="text-2xl font-temple text-temple-red-800">
                    聯絡資訊
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      required
                      placeholder="請輸入您的姓名"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">電子郵件 *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">聯絡電話 *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="09XX-XXX-XXX"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-temple-gold-300 shadow-lg">
                <CardHeader className="bg-temple-gold-50">
                  <CardTitle className="text-2xl font-temple text-temple-red-800">
                    付款方式（綠界金流）
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-temple-red-600 bg-temple-red-50'
                          : 'border-temple-gold-200 hover:border-temple-gold-400'
                      }`}
                      onClick={() => setPaymentMethod('credit_card')}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <div className="font-bold">信用卡</div>
                          <div className="text-xs text-gray-600">VISA / MasterCard / JCB</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'atm'
                          ? 'border-temple-red-600 bg-temple-red-50'
                          : 'border-temple-gold-200 hover:border-temple-gold-400'
                      }`}
                      onClick={() => setPaymentMethod('atm')}
                    >
                      <div className="flex items-center gap-3">
                        <Banknote className="w-6 h-6 text-green-600" />
                        <div>
                          <div className="font-bold">ATM 轉帳</div>
                          <div className="text-xs text-gray-600">虛擬帳號繳費</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'cvs'
                          ? 'border-temple-red-600 bg-temple-red-50'
                          : 'border-temple-gold-200 hover:border-temple-gold-400'
                      }`}
                      onClick={() => setPaymentMethod('cvs')}
                    >
                      <div className="flex items-center gap-3">
                        <Store className="w-6 h-6 text-orange-600" />
                        <div>
                          <div className="font-bold">超商代碼</div>
                          <div className="text-xs text-gray-600">7-11 / 全家</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p>本平台採用<strong>綠界 ECPay</strong> 安全加密付款系統</p>
                      <p className="text-xs mt-1 text-blue-700">您的付款資訊受到銀行級加密保護，請安心使用</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-temple-gold-300 shadow-lg">
                <CardHeader className="bg-temple-gold-50">
                  <CardTitle className="text-2xl font-temple text-temple-red-800">
                    訂單明細
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {items.map(item => (
                    <div key={item.lanternId} className="flex justify-between py-2 border-b border-temple-gold-100">
                      <div>
                        <div className="font-medium">{item.lanternName}</div>
                        <div className="text-sm text-gray-600">
                          {item.templeName} | {item.believerName} | x{item.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-temple-red-700">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center pt-4 text-2xl font-temple font-bold">
                    <span className="text-gray-800">總金額</span>
                    <span className="text-temple-red-700">{formatPrice(getTotalPrice())}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Button
                type="submit"
                variant="temple"
                size="xl"
                className="w-full"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="animate-spin mr-3">⏳</div>
                    正在跳轉至付款頁面...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    前往付款 {formatPrice(getTotalPrice())}
                  </>
                )}
              </Button>

              {/* 測試按鈕（開發模式） */}
              {process.env.NODE_ENV !== 'production' && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full text-gray-500"
                  onClick={handleTestPayment}
                  disabled={processing}
                >
                  🧪 模擬付款成功（測試用）
                </Button>
              )}
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}
