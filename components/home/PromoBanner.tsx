'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// 模擬廣告資料（實際應從 API 取得）
const mockBanners = [
  {
    id: 1,
    title: '2025新春祈福特惠',
    subtitle: '光明燈、平安燈全面8折',
    image: '/banners/new-year.jpg',
    link: '/events/new-year-blessing-2025',
    templeName: '艋舺龍山寺',
    bgColor: 'from-red-600 to-red-800',
    active: true,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 2,
    title: '元宵節點燈活動',
    subtitle: '報名即送精美福袋',
    image: '/banners/lantern.jpg',
    link: '/events/yuanxiao-lantern-2025',
    templeName: '臺北行天宮',
    bgColor: 'from-orange-500 to-red-600',
    active: true,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
  },
  {
    id: 3,
    title: '月老燈特別企劃',
    subtitle: '祈求良緣，姻緣燈85折',
    image: '/banners/love.jpg',
    link: '/temples/xiahai-temple',
    templeName: '臺北霞海城隍廟',
    bgColor: 'from-pink-500 to-rose-600',
    active: true,
    startDate: '2024-01-01',
    endDate: '2026-12-31',
  },
]

export function PromoBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // 過濾有效的廣告
  const activeBanners = mockBanners.filter(banner => {
    if (!banner.active) return false
    const now = new Date()
    const start = new Date(banner.startDate)
    const end = new Date(banner.endDate)
    return now >= start && now <= end
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // 自動輪播
  useEffect(() => {
    if (activeBanners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [activeBanners.length])

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length)
  }

  if (!mounted || activeBanners.length === 0) return null

  const currentBanner = activeBanners[currentIndex]

  return (
    <section className="relative w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative h-[400px] md:h-[500px] bg-gradient-to-r ${currentBanner.bgColor}`}
        >
          {/* 背景裝飾 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 text-8xl">🏮</div>
            <div className="absolute bottom-10 right-10 text-8xl">🏮</div>
            <div className="absolute top-1/2 left-1/4 text-6xl">✨</div>
            <div className="absolute top-1/3 right-1/4 text-6xl">✨</div>
          </div>

          {/* 內容 */}
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-white"
            >
              <h2 className="text-4xl md:text-6xl font-temple font-bold mb-4 drop-shadow-lg">
                {currentBanner.title}
              </h2>
              <p className="text-xl md:text-2xl opacity-90 mb-8">
                {currentBanner.subtitle}
              </p>
              <Link href={currentBanner.link}>
                <Button variant="gold" size="lg">
                  立即查看 →
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* 廟宇標籤 */}
          <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
            🏛️ {currentBanner.templeName}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 導航按鈕 */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* 指示點 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}


