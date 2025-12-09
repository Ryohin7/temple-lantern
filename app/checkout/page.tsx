'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { FireworkEffect } from '@/components/temple/TempleDecoration'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [showFireworks, setShowFireworks] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit_card')
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('請填寫所有必填欄位')
      return
    }

    setProcessing(true)

    // Simulate payment processing
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
                    付款方式
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'credit_card'
                          ? 'border-temple-red-600 bg-temple-red-50'
                          : 'border-temple-gold-200 hover:border-temple-gold-400'
                      }`}
                      onClick={() => setPaymentMethod('credit_card')}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6" />
                        <div>
                          <div className="font-bold">信用卡</div>
                          <div className="text-sm text-gray-600">VISA / MasterCard / JCB</div>
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
                        <div className="text-2xl">🏦</div>
                        <div>
                          <div className="font-bold">ATM 轉帳</div>
                          <div className="text-sm text-gray-600">虛擬帳號繳費</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      本平台採用安全加密付款系統，您的付款資訊受到完善保護
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
                    處理中...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    確認付款 {formatPrice(getTotalPrice())}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}

