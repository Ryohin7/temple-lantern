'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Flame, Calendar, Eye, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

export default function OrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState('')
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setAllOrders(data)
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

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
      setOrders(allOrders)
      return
    }
    const filtered = allOrders.filter(order =>
      order.id.toLowerCase().includes(searchId.toLowerCase())
    )
    setOrders(filtered)
  }

  if (!mounted || loading) {
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
                    {searchId ? '請確認訂單編號是否正確' : '您還沒有任何訂單'}
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
                              {new Date(order.created_at).toLocaleDateString('zh-TW')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-4 h-4 text-temple-red-600" />
                              {order.temples?.name}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Order Items */}
                      <div className="space-y-3 mb-6">
                        {order.order_items?.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-dashed last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">🏮</span>
                              <span className="font-medium">{item.lantern_products?.name}</span>
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
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-gray-500 text-sm">訂單金額</span>
                            <div className="text-xl font-bold text-temple-red-700">
                              NT$ {order.total_amount?.toLocaleString()}
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
