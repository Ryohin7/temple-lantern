'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Lantern } from '@/components/temple/Lantern'

export default function CartPage() {
  const router = useRouter()
  const { items, removeItem, updateItem, getTotalPrice, clearCart } = useCartStore()
  const [believerInfo, setBelieverInfo] = useState<{ [key: string]: any }>({})

  const handleUpdateQuantity = (lanternId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    updateItem(lanternId, { quantity: newQuantity })
  }

  const handleUpdateBelieverInfo = (lanternId: string, field: string, value: string) => {
    setBelieverInfo(prev => ({
      ...prev,
      [lanternId]: {
        ...prev[lanternId],
        [field]: value
      }
    }))
    
    updateItem(lanternId, { [field]: value })
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    
    // Check if all items have believer names
    const hasEmptyNames = items.some(item => !item.believerName)
    if (hasEmptyNames) {
      alert('請填寫所有點燈人姓名')
      return
    }
    
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-temple-red-50 to-white flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="relative inline-block">
            <Lantern size="lg" color="red" animate />
          </div>
          <h2 className="text-3xl font-temple font-bold text-temple-red-800">
            購物車是空的
          </h2>
          <p className="text-gray-600">
            還沒有選擇任何點燈項目，快去選擇適合的燈種吧！
          </p>
          <Button variant="temple" size="lg" onClick={() => router.push('/temples')}>
            前往廟宇列表
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-temple font-bold text-temple-red-800 mb-4 flex items-center justify-center gap-3">
            <ShoppingCart className="w-12 h-12" />
            購物車
          </h1>
          <p className="text-gray-600 text-lg">
            確認您的點燈項目與資訊
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.lanternId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-temple-gold-300 shadow-lg overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-temple-red-100 to-temple-gold-100 flex items-center justify-center">
                        {item.lanternImage ? (
                          <Image
                            src={item.lanternImage}
                            alt={item.lanternName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <Lantern size="md" color="red" animate={false} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-4">
                        {/* Title & Temple */}
                        <div>
                          <h3 className="text-2xl font-temple font-bold text-temple-red-800">
                            {item.lanternName}
                          </h3>
                          <p className="text-gray-600">
                            🏯 {item.templeName}
                          </p>
                        </div>

                        {/* Believer Info Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-temple-gold-50 p-4 rounded-lg">
                          <div>
                            <Label htmlFor={`name-${item.lanternId}`} className="text-sm font-medium">
                              點燈人姓名 *
                            </Label>
                            <Input
                              id={`name-${item.lanternId}`}
                              placeholder="請輸入姓名"
                              value={item.believerName || ''}
                              onChange={(e) => handleUpdateBelieverInfo(item.lanternId, 'believerName', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`birthdate-${item.lanternId}`} className="text-sm font-medium">
                              出生日期（選填）
                            </Label>
                            <Input
                              id={`birthdate-${item.lanternId}`}
                              type="date"
                              value={item.birthDate || ''}
                              onChange={(e) => handleUpdateBelieverInfo(item.lanternId, 'birthDate', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`wish-${item.lanternId}`} className="text-sm font-medium">
                              祈福願望（選填）
                            </Label>
                            <Input
                              id={`wish-${item.lanternId}`}
                              placeholder="請輸入您的祈福願望"
                              value={item.wishText || ''}
                              onChange={(e) => handleUpdateBelieverInfo(item.lanternId, 'wishText', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.lanternId, item.quantity - 1)}
                              className="border-temple-gold-300"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-xl font-bold w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.lanternId, item.quantity + 1)}
                              className="border-temple-gold-300"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold font-temple text-temple-red-700">
                              {formatPrice(item.price * item.quantity)}
                            </div>
                            <div className="text-sm text-gray-500">
                              單價 {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.lanternId)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          移除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-2 border-temple-gold-300 shadow-lg">
                  <CardHeader className="bg-temple-gradient text-white">
                    <CardTitle className="text-2xl font-temple">
                      訂單摘要
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Items Count */}
                    <div className="flex justify-between text-gray-600">
                      <span>項目數量</span>
                      <span className="font-bold">{items.length} 項</span>
                    </div>

                    {/* Items Summary */}
                    <div className="space-y-2 border-t border-b border-temple-gold-200 py-4">
                      {items.map(item => (
                        <div key={item.lanternId} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.lanternName} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-xl font-temple font-bold text-gray-800">
                        總金額
                      </span>
                      <span className="text-3xl font-temple font-bold text-temple-red-700">
                        {formatPrice(getTotalPrice())}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3 pt-4">
                      <Button
                        variant="temple"
                        size="lg"
                        className="w-full"
                        onClick={handleCheckout}
                      >
                        前往結帳
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full border-temple-gold-300"
                        onClick={() => router.push('/temples')}
                      >
                        繼續選購
                      </Button>
                    </div>

                    {/* Note */}
                    <div className="text-xs text-gray-500 text-center pt-4 border-t border-temple-gold-200">
                      💡 請確認所有資訊正確無誤後再進行結帳
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

