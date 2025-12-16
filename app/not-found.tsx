'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Lantern } from '@/components/temple/Lantern'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 via-temple-orange-50 to-temple-gold-50 flex items-center justify-center p-4">
      {/* 背景燈籠 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <motion.div className="absolute top-20 left-[10%]">
          <Lantern size="sm" color="red" animate />
        </motion.div>
        <motion.div className="absolute top-40 right-[10%]">
          <Lantern size="md" color="gold" animate />
        </motion.div>
        <motion.div className="absolute bottom-20 left-[20%]">
          <Lantern size="sm" color="orange" animate />
        </motion.div>
        <motion.div className="absolute bottom-40 right-[20%]">
          <Lantern size="md" color="red" animate />
        </motion.div>
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 數字 */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-temple font-bold text-temple-red-200 leading-none">
              404
            </h1>
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                y: [0, -10, 0],
                rotate: [-5, 5, -5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-8xl">🏮</span>
            </motion.div>
          </div>

          {/* 標題 */}
          <h2 className="text-3xl md:text-4xl font-temple font-bold text-temple-red-800 mb-4">
            哎呀！這盞燈找不到了
          </h2>

          {/* 描述 */}
          <p className="text-gray-600 text-lg mb-8">
            您尋找的頁面可能已被移動、刪除，或從未存在。
            <br />
            別擔心，讓我們幫您找到正確的方向！
          </p>

          {/* 按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="temple" size="lg" className="min-w-[160px]">
                <Home className="w-5 h-5 mr-2" />
                回到首頁
              </Button>
            </Link>
            <Link href="/temples">
              <Button variant="outline" size="lg" className="min-w-[160px] border-temple-gold-400">
                <Search className="w-5 h-5 mr-2" />
                瀏覽廟宇
              </Button>
            </Link>
          </div>

          {/* 快速連結 */}
          <div className="mt-12 pt-8 border-t border-temple-gold-200">
            <p className="text-gray-500 mb-4">或者您可能在找...</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/how-it-works" className="text-temple-red-600 hover:text-temple-red-700 hover:underline">
                如何點燈
              </Link>
              <Link href="/faq" className="text-temple-red-600 hover:text-temple-red-700 hover:underline">
                常見問題
              </Link>
              <Link href="/contact" className="text-temple-red-600 hover:text-temple-red-700 hover:underline">
                聯絡我們
              </Link>
              <Link href="/about" className="text-temple-red-600 hover:text-temple-red-700 hover:underline">
                關於我們
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}






