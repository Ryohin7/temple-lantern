'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Tag, Clock, Flame, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'
import { PriceDisplay } from '@/components/ui/price-display'

// V1.0 正式版：模擬資料已移除，改為從 API 獲取
// 請實作 API 端點：/api/promo-items

interface PromoItem {
  id: number
  type: 'lantern' | 'event'
  name: string
  temple: string
  templeSlug: string
  originalPrice: number
  salePrice: number
  saleEnd: string
  stock: number
  sold: number
  description: string
  eventSlug?: string
}

export function PromoSection() {
  const [mounted, setMounted] = useState(false)
  const [promoItems, setPromoItems] = useState<PromoItem[]>([])

  useEffect(() => {
    setMounted(true)
    const fetchPromoItems = async () => {
      try {
        const response = await fetch('/api/promo-items')
        if (response.ok) {
          const data = await response.json()
          setPromoItems(data)
        }
      } catch (error) {
        console.error('Failed to fetch promo items:', error)
        setPromoItems([])
      }
    }
    fetchPromoItems()
  }, [])

  if (!mounted) return null

  // 過濾有效的優惠
  const activePromos = promoItems.filter(item => {
    const now = new Date()
    const end = new Date(item.saleEnd)
    return now <= end && item.stock > item.sold
  })

  if (activePromos.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-b from-red-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold mb-4">
              <Tag className="w-4 h-4" />
              限時優惠
            </span>
            <h2 className="text-4xl font-temple font-bold text-temple-red-800 mb-4">
              🔥 優惠活動專區
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              精選點燈與法會活動優惠，把握機會為自己和家人祈福
            </p>
          </motion.div>
        </div>

        {/* Promo Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activePromos.map((item, index) => {
            const remaining = item.stock - item.sold
            const progress = (item.sold / item.stock) * 100
            const link = item.type === 'event'
              ? `/events/${item.eventSlug}`
              : `/temples/${item.templeSlug}`

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={link}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all group border-2 hover:border-red-400">
                    {/* 優惠標籤 */}
                    <div className="relative h-32 bg-temple-gradient flex items-center justify-center">
                      <Lantern size="md" color="gold" animate={false} />

                      {/* 折扣標籤 */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                          {Math.round((1 - item.salePrice / item.originalPrice) * 100)}% OFF
                        </span>
                      </div>

                      {/* 類型標籤 */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-white text-xs font-bold rounded ${item.type === 'event' ? 'bg-blue-600' : 'bg-orange-600'
                          }`}>
                          {item.type === 'event' ? '法會' : '點燈'}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* 廟宇 */}
                      <div className="text-xs text-temple-gold-600 flex items-center gap-1 mb-1">
                        <Flame className="w-3 h-3" />
                        {item.temple}
                      </div>

                      {/* 名稱 */}
                      <h3 className="font-bold text-temple-red-800 group-hover:text-red-600 transition-colors mb-1">
                        {item.name}
                      </h3>

                      {/* 描述 */}
                      <p className="text-gray-500 text-xs mb-3 line-clamp-1">
                        {item.description}
                      </p>

                      {/* 價格 */}
                      <PriceDisplay
                        originalPrice={item.originalPrice}
                        salePrice={item.salePrice}
                        saleEnd={item.saleEnd}
                        size="sm"
                        showDiscount={false}
                      />

                      {/* 剩餘數量 */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            已售 {item.sold}
                          </span>
                          <span className={`font-bold ${remaining <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
                            剩餘 {remaining} {item.type === 'event' ? '名額' : '盞'}
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${progress >= 80 ? 'bg-red-500' :
                              progress >= 50 ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* 倒數 */}
                      <div className="mt-3 flex items-center gap-1 text-xs text-orange-600">
                        <Clock className="w-3 h-3" />
                        優惠至 {item.saleEnd}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Link href="/temples">
            <Button variant="outline" size="lg" className="border-temple-red-400 text-temple-red-600 hover:bg-temple-red-50">
              查看更多優惠
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}





