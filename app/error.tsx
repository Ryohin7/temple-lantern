'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Lantern } from '@/components/temple/Lantern'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 可以在這裡記錄錯誤
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 via-temple-orange-50 to-temple-gold-50 flex items-center justify-center p-4">
      {/* 背景燈籠 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <motion.div className="absolute top-20 left-[10%]">
          <Lantern size="sm" color="red" animate />
        </motion.div>
        <motion.div className="absolute bottom-20 right-[10%]">
          <Lantern size="md" color="gold" animate />
        </motion.div>
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 錯誤圖示 */}
          <div className="mb-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>
            </motion.div>
          </div>

          {/* 標題 */}
          <h2 className="text-3xl md:text-4xl font-temple font-bold text-temple-red-800 mb-4">
            哎呀！出了點問題
          </h2>

          {/* 描述 */}
          <p className="text-gray-600 text-lg mb-8">
            非常抱歉，發生了一些技術問題。
            <br />
            請重新整理頁面或稍後再試。
          </p>

          {/* 按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="temple"
              size="lg"
              onClick={reset}
              className="min-w-[160px]"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              重新整理
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg" className="min-w-[160px] border-temple-gold-400">
                <Home className="w-5 h-5 mr-2" />
                回到首頁
              </Button>
            </Link>
          </div>

          {/* 錯誤詳情（開發環境） */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-red-50 rounded-lg text-left border border-red-200">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* 聯絡資訊 */}
          <div className="mt-8 pt-8 border-t border-temple-gold-200">
            <p className="text-gray-500 text-sm">
              如果問題持續發生，請聯繫我們：
            </p>
            <a
              href="mailto:contact@temple-lantern.tw"
              className="text-temple-red-600 hover:text-temple-red-700"
            >
              contact@temple-lantern.tw
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}


