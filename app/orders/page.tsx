'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Flame, Calendar, Eye, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 模擬訂單資料
const mockOrders = [
  {
    id: 'TL2024121001',
    date: '2024-12-10',
    temple: '艋舺龍山寺',
    items: [
      { name: '光明燈', quantity: 1, price: 1200 },
      { name: '平安燈', quantity: 2, price: 1000 },
    ],
    total: 3200,
    status: 'completed',
    believer: '王○明'
  },
  {
    id: 'TL2024120901',
    date: '2024-12-09',
    temple: '臺北行天宮',
    items: [
      { name: '財神燈', quantity: 1, price: 1800 },
    ],
    total: 1800,
    status: 'processing',
    believer: '王○明'
  },
  {
    id: 'TL2024120501',
    date: '2024-12-05',
    temple: '臺北霞海城隍廟',
    items: [
      { name: '月老燈', quantity: 1, price: 1500 },
    ],
    total: 1500,
    status: 'completed',
    believer: '王○明'
  },
]

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [searchId, setSearchId] = useState('')
  const [orders, setOrders] = useState(mockOrders)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">已完成</span>
      case 'processing':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">處理中</span>
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">待處理</span>
      case 'cancelled':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">已取消</span>
      default:
        return null
    }
  }

  const handleSearch = () => {
    if (!searchId) {
      setOrders(mockOrders)
      return
    }
    const filtered = mockOrders.filter(order => 
      order.id.toLowerCase().includes(searchId.toLowerCase())
    )
    setOrders(filtered)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      {/* Header */}
      <section className="bg-temple-gradient py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <Lantern size="md" color="gold" animate />
            </div>
            <h1 className="text-4xl font-temple font-bold">📋 我的訂單</h1>
            <p className="text-lg opacity-90">查看您的點燈訂單記錄</p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="輸入訂單編號查詢..."
                className="pl-10"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="temple" onClick={handleSearch}>
              查詢
            </Button>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-600 mb-2">找不到訂單</h3>
                  <p className="text-gray-500 mb-6">
                    請確認訂單編號是否正確
                  </p>
                  <Button variant="temple" asChild>
                    <Link href="/temples">前往點燈</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-temple-gold-200 hover:border-temple-gold-400 transition-colors overflow-hidden">
                    <CardHeader className="bg-temple-gold-50 border-b border-temple-gold-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-mono">
                            {order.id}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {order.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4 text-temple-red-600" />
                              {order.temple}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Order Items */}
                      <div className="space-y-3 mb-6">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-dashed last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">🏮</span>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500">x {item.quantity}</span>
                            </div>
                            <span className="font-medium">
                              NT$ {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <span className="text-gray-500">點燈信眾：</span>
                          <span className="font-medium">{order.believer}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-gray-500 text-sm">訂單金額</span>
                            <div className="text-xl font-bold text-temple-red-700">
                              NT$ {order.total.toLocaleString()}
                            </div>
                          </div>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="outline" className="border-temple-gold-400">
                              <Eye className="w-4 h-4 mr-2" />
                              查看詳情
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-temple-gradient">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-temple font-bold mb-4">想要再次點燈祈福？</h2>
          <Button variant="gold" size="lg" asChild>
            <Link href="/temples">瀏覽廟宇</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}




