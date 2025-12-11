'use client'

import { useMemo } from 'react'
import { Tag, Clock } from 'lucide-react'

interface PriceDisplayProps {
  originalPrice: number
  salePrice?: number
  saleStart?: string
  saleEnd?: string
  showDiscount?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PriceDisplay({
  originalPrice,
  salePrice,
  saleStart,
  saleEnd,
  showDiscount = true,
  size = 'md',
  className = '',
}: PriceDisplayProps) {
  // 計算是否在優惠期間
  const isOnSale = useMemo(() => {
    if (!salePrice) return false
    
    const now = new Date()
    const start = saleStart ? new Date(saleStart) : null
    const end = saleEnd ? new Date(saleEnd) : null
    
    if (start && now < start) return false
    if (end && now > end) return false
    
    return true
  }, [salePrice, saleStart, saleEnd])

  // 計算折扣百分比
  const discountPercent = useMemo(() => {
    if (!isOnSale || !salePrice) return 0
    return Math.round((1 - salePrice / originalPrice) * 100)
  }, [isOnSale, salePrice, originalPrice])

  // 計算剩餘時間
  const timeLeft = useMemo(() => {
    if (!isOnSale || !saleEnd) return null
    
    const now = new Date()
    const end = new Date(saleEnd)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `剩 ${days} 天`
    if (hours > 0) return `剩 ${hours} 小時`
    return '即將結束'
  }, [isOnSale, saleEnd])

  const sizeClasses = {
    sm: {
      original: 'text-sm',
      sale: 'text-lg',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      original: 'text-base',
      sale: 'text-2xl',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      original: 'text-lg',
      sale: 'text-3xl',
      badge: 'text-sm px-2 py-1',
    },
  }

  const classes = sizeClasses[size]

  return (
    <div className={`${className}`}>
      {isOnSale ? (
        <div className="space-y-1">
          {/* 優惠標籤 */}
          <div className="flex items-center gap-2 flex-wrap">
            {showDiscount && discountPercent > 0 && (
              <span className={`${classes.badge} bg-red-600 text-white rounded-full font-bold flex items-center gap-1`}>
                <Tag className="w-3 h-3" />
                -{discountPercent}%
              </span>
            )}
            {timeLeft && (
              <span className={`${classes.badge} bg-orange-100 text-orange-700 rounded-full flex items-center gap-1`}>
                <Clock className="w-3 h-3" />
                {timeLeft}
              </span>
            )}
          </div>
          
          {/* 價格 */}
          <div className="flex items-baseline gap-2">
            <span className={`${classes.sale} font-bold text-red-600`}>
              NT$ {salePrice!.toLocaleString()}
            </span>
            <span className={`${classes.original} text-gray-400 line-through`}>
              NT$ {originalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className={`${classes.sale} font-bold text-temple-red-700`}>
          NT$ {originalPrice.toLocaleString()}
        </div>
      )}
    </div>
  )
}

// 優惠倒數計時組件
export function SaleCountdown({ endDate }: { endDate: string }) {
  const timeLeft = useMemo(() => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return null
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
  }, [endDate])

  if (!timeLeft) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock className="w-4 h-4 text-red-500" />
      <span className="text-gray-600">優惠倒數：</span>
      <div className="flex gap-1">
        {timeLeft.days > 0 && (
          <span className="bg-red-600 text-white px-2 py-1 rounded font-bold">
            {timeLeft.days}天
          </span>
        )}
        <span className="bg-red-600 text-white px-2 py-1 rounded font-bold">
          {timeLeft.hours}時
        </span>
        <span className="bg-red-600 text-white px-2 py-1 rounded font-bold">
          {timeLeft.minutes}分
        </span>
      </div>
    </div>
  )
}


