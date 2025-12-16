'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Phone, Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface TempleCardProps {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  main_god: string
  banner_image: string | null
  logo_image: string | null
  theme_color: string
}

export function TempleCard({
  slug,
  name,
  description,
  address,
  main_god,
  banner_image,
  logo_image,
  theme_color
}: TempleCardProps) {
  return (
    <Link href={`/temples/${slug}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden border-2 border-temple-gold-300 shadow-lg hover:shadow-2xl transition-all cursor-pointer group">
          {/* 橫幅圖片 */}
          <div className="relative h-48 overflow-hidden">
            {banner_image ? (
              <Image
                src={banner_image}
                alt={name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div 
                className="w-full h-full bg-gradient-to-br from-temple-red-700 to-temple-orange-600"
                style={{ 
                  background: `linear-gradient(135deg, ${theme_color} 0%, #ea580c 100%)` 
                }}
              />
            )}
            
            {/* 漸層遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Logo */}
            {logo_image && (
              <div className="absolute top-4 left-4 w-16 h-16 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <Image
                  src={logo_image}
                  alt={`${name} Logo`}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            {/* 廟宇名稱 */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-2xl font-temple font-bold text-white drop-shadow-lg mb-1">
                {name}
              </h3>
              <div className="flex items-center gap-2 text-temple-gold-300 text-sm">
                <Flame className="w-4 h-4" />
                <span className="font-medium">主祀：{main_god}</span>
              </div>
            </div>
          </div>
          
          <CardContent className="p-5 space-y-3">
            {/* 描述 */}
            {description && (
              <p className="text-gray-600 text-sm line-clamp-2">
                {description}
              </p>
            )}
            
            {/* 地址 */}
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-temple-red-600" />
              <span className="line-clamp-1">{address}</span>
            </div>
            
            {/* 按鈕 */}
            <Button 
              variant="temple" 
              className="w-full mt-4"
              asChild
            >
              <span>
                🙏 進入廟宇參拜
              </span>
            </Button>
          </CardContent>
          
          {/* 裝飾元素 */}
          <div className="absolute top-2 right-2 text-4xl opacity-20 group-hover:opacity-40 transition-opacity">
            🏯
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}






