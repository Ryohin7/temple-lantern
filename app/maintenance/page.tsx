'use client'

import { motion } from 'framer-motion'
import { Wrench, Clock, Mail, Phone } from 'lucide-react'
import { Lantern } from '@/components/temple/Lantern'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-temple-red-100 via-temple-gold-50 to-temple-orange-100">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-10 left-10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Lantern size="lg" color="red" animate />
        </motion.div>
        <motion.div 
          className="absolute top-20 right-20"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          <Lantern size="md" color="gold" animate />
        </motion.div>
        <motion.div 
          className="absolute bottom-20 left-1/4"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        >
          <Lantern size="md" color="red" animate />
        </motion.div>
        <motion.div 
          className="absolute bottom-32 right-1/4"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: 1.5 }}
        >
          <Lantern size="lg" color="gold" animate />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-2 border-temple-gold-300"
        >
          {/* 圖示 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 bg-temple-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <Wrench className="w-12 h-12 text-white" />
          </motion.div>

          {/* 標題 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-temple font-bold text-temple-red-700 mb-4"
          >
            系統維護中
          </motion.h1>

          {/* 副標題 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            我們正在進行系統維護升級，為您帶來更好的服務體驗
          </motion.p>

          {/* 預計時間 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-temple-gold-50 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-3 text-temple-red-700">
              <Clock className="w-6 h-6" />
              <span className="text-lg font-medium">預計維護時間</span>
            </div>
            <p className="text-2xl font-bold text-temple-red-800 mt-2">
              約 2 小時
            </p>
            <p className="text-gray-500 text-sm mt-1">
              維護完成後將自動恢復服務
            </p>
          </motion.div>

          {/* 聯絡資訊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600"
          >
            <p className="mb-4">如有緊急事項，請聯繫我們：</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
              <a 
                href="mailto:contact@temple-lantern.tw" 
                className="flex items-center gap-2 text-temple-red-600 hover:text-temple-red-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@temple-lantern.tw
              </a>
              <span className="hidden md:inline text-gray-300">|</span>
              <a 
                href="tel:02-1234-5678" 
                className="flex items-center gap-2 text-temple-red-600 hover:text-temple-red-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                02-1234-5678
              </a>
            </div>
          </motion.div>

          {/* 進度動畫 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <div className="h-2 bg-temple-gold-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-temple-gradient"
                initial={{ width: '0%' }}
                animate={{ width: ['0%', '30%', '60%', '30%'] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">維護進行中...</p>
          </motion.div>
        </motion.div>

        {/* 底部文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-gray-500 text-sm"
        >
          感謝您的耐心等待 🙏
        </motion.p>
      </div>
    </div>
  )
}





