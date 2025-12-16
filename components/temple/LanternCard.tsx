'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import { Lantern } from './Lantern'

interface LanternCardProps {
  id: string
  name: string
  description: string
  benefits: string
  price: number
  duration_months: number
  image: string | null
  category: string
  onAddToCart: () => void
  onViewDetails: () => void
}

export function LanternCard({
  name,
  description,
  benefits,
  price,
  duration_months,
  image,
  category,
  onAddToCart,
  onViewDetails
}: LanternCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-2 border-temple-gold-300 bg-gradient-to-b from-white to-orange-50/50 shadow-lg hover:shadow-2xl transition-shadow">
        <CardHeader className="relative p-0">
          {/* 背景裝飾 */}
          <div className="absolute inset-0 bg-temple-pattern opacity-5" />
          
          {/* 圖片或燈籠動畫 */}
          <div className="relative h-48 bg-gradient-to-b from-temple-red-600/10 to-temple-gold-400/10 flex items-center justify-center">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
              />
            ) : (
              <Lantern size="lg" color="red" animate />
            )}
            
            {/* 發光效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* 類別標籤 */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-temple-red-600 text-white rounded-full text-sm font-temple shadow-lg">
              {getCategoryIcon(category)} {getCategoryLabel(category)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-3">
          <CardTitle className="text-2xl font-temple text-temple-red-800 flex items-center gap-2">
            {name}
            <span className="text-temple-gold-500">✨</span>
          </CardTitle>
          
          <CardDescription className="text-gray-600 line-clamp-2">
            {description}
          </CardDescription>
          
          {/* 功效說明 */}
          <div className="flex items-start gap-2 p-3 bg-temple-gold-50 rounded-lg border border-temple-gold-200">
            <span className="text-temple-gold-600 mt-0.5">🙏</span>
            <p className="text-sm text-temple-red-700 flex-1">
              {benefits}
            </p>
          </div>
          
          {/* 價格與期限 */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-3xl font-bold font-temple text-temple-red-700">
                {formatPrice(price)}
              </div>
              <div className="text-xs text-gray-500">
                供奉期限：{duration_months} 個月
              </div>
            </div>
            <div className="text-4xl opacity-20">
              🏮
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-temple-gold-300 hover:bg-temple-gold-50"
            onClick={onViewDetails}
          >
            <Info className="w-4 h-4 mr-2" />
            詳細資訊
          </Button>
          <Button
            variant="temple"
            size="lg"
            className="flex-1"
            onClick={onAddToCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            點燈祈福
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    guangming: '🏮',
    caishen: '💰',
    yuelao: '💕',
    wenchang: '📚',
    pingan: '🙏',
    taisui: '⭐',
    career: '💼',
    health: '❤️',
  }
  return icons[category] || '🏮'
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    guangming: '光明燈',
    caishen: '財神燈',
    yuelao: '月老燈',
    wenchang: '文昌燈',
    pingan: '平安燈',
    taisui: '太歲燈',
    career: '事業燈',
    health: '健康燈',
  }
  return labels[category] || '祈福燈'
}







