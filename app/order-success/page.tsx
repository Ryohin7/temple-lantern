'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Home, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'
import { LotusDecoration, CloudDecoration } from '@/components/temple/TempleDecoration'

export default function OrderSuccessPage() {
  const router = useRouter()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowContent(true), 500)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-gold-50 via-temple-orange-50 to-temple-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 cloud-pattern opacity-30" />
      <CloudDecoration className="top-10 left-10" />
      <CloudDecoration className="top-20 right-20" />
      <LotusDecoration className="bottom-10 left-20" />
      <LotusDecoration className="bottom-10 right-20" />

      {/* 飄動的燈籠 */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-20 left-[15%]"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Lantern size="md" color="gold" />
        </motion.div>
        <motion.div 
          className="absolute top-32 right-[15%]"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <Lantern size="lg" color="red" />
        </motion.div>
        <motion.div 
          className="absolute bottom-32 left-[20%]"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        >
          <Lantern size="sm" color="orange" />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-[20%]"
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
        >
          <Lantern size="md" color="gold" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-4 border-temple-gold-400 shadow-2xl overflow-hidden">
            {/* 成功圖示 */}
            <div className="bg-temple-gradient p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 cloud-pattern opacity-20" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-2xl mb-6">
                  <CheckCircle className="w-20 h-20 text-green-600" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-5xl font-temple font-bold text-white drop-shadow-lg mb-4"
              >
                點燈成功！
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-2xl text-white/90"
              >
                願神明保佑，諸事順遂 🙏
              </motion.p>
            </div>

            <CardContent className="p-8 space-y-6">
              {/* 成功訊息 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.7 }}
                className="text-center space-y-4"
              >
                <div className="text-6xl mb-4">✨</div>
                <h2 className="text-3xl font-temple font-bold text-temple-red-800">
                  您的祈福已送達
                </h2>
                <p className="text-gray-600 text-lg">
                  廟方將盡快為您點燈，並寄送點燈證明至您的電子信箱
                </p>
              </motion.div>

              {/* 訂單資訊 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.8 }}
                className="bg-temple-gold-50 rounded-lg p-6 border-2 border-temple-gold-200"
              >
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-gray-600 text-sm mb-1">訂單編號</div>
                    <div className="font-bold text-temple-red-700 font-mono">
                      #{Math.random().toString(36).substring(2, 10).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm mb-1">訂單日期</div>
                    <div className="font-bold text-temple-red-700">
                      {new Date().toLocaleDateString('zh-TW')}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 接下來的步驟 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <h3 className="font-temple font-bold text-xl text-temple-red-800 mb-4">
                  接下來會發生什麼？
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: '📧', text: '您將收到訂單確認信' },
                    { icon: '🏮', text: '廟方將在 1-2 個工作天內為您點燈' },
                    { icon: '📜', text: '點燈完成後將寄送電子證明' },
                    { icon: '🙏', text: '可隨時至會員中心查看點燈狀態' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-temple-gold-200">
                      <span className="text-2xl">{step.icon}</span>
                      <span className="text-gray-700">{step.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 按鈕 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6"
              >
                <Button
                  variant="temple"
                  size="lg"
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  <Home className="w-5 h-5 mr-2" />
                  返回首頁
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/temples')}
                  className="w-full border-temple-gold-400"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  繼續點燈
                </Button>
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => router.push('/dashboard/user/orders')}
                  className="w-full"
                >
                  <Download className="w-5 h-5 mr-2" />
                  查看訂單
                </Button>
              </motion.div>

              {/* 祝福語 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showContent ? 1 : 0 }}
                transition={{ delay: 1.1 }}
                className="text-center pt-6 border-t border-temple-gold-200"
              >
                <p className="text-temple-gold-700 font-temple text-lg">
                  ✨ 心想事成 · 萬事如意 ✨
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


