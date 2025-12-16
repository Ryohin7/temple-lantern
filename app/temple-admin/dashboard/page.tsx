'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { TrendingUp, ShoppingBag, Flame, Calendar, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

export default function TempleAdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const res = await fetch('/api/temple-admin/dashboard')
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
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
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-temple font-bold text-temple-red-800">廟宇管理儀表板</h1>
          <p className="text-gray-600 mt-2">管理您的廟宇點燈服務</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-temple-gold-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">本月訂單</p>
                    <p className="text-3xl font-bold text-temple-red-700">{stats?.monthlyOrders || 0}</p>
                  </div>
                  <ShoppingBag className="w-12 h-12 text-temple-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-temple-gold-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">本月收入</p>
                    <p className="text-3xl font-bold text-temple-red-700">
                      ${stats?.monthlyRevenue?.toLocaleString() || 0}
                    </p>
                  </div>
                  <DollarSign className="w-12 h-12 text-temple-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-temple-gold-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">進行中點燈</p>
                    <p className="text-3xl font-bold text-temple-red-700">{stats?.activeLanterns || 0}</p>
                  </div>
                  <Flame className="w-12 h-12 text-temple-red-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-temple-gold-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">成長率</p>
                    <p className="text-3xl font-bold text-green-600">+{stats?.growthRate || 0}%</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-temple-gold-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-temple">最近訂單</CardTitle>
                <Button variant="outline" asChild>
                  <Link href="/temple-admin/orders">查看全部</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">目前沒有訂單</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order: any) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-temple-gold-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Lantern size="sm" color="red" animate={false} />
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('zh-TW')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-temple-red-700">
                          NT$ {order.total_amount?.toLocaleString()}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                          }`}>
                          {order.status === 'completed' ? '已完成' :
                            order.status === 'processing' ? '處理中' : '待處理'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-xl font-temple font-bold mb-4">快速操作</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/temple-admin/orders">
              <Card className="border-2 border-temple-gold-200 hover:border-temple-gold-400 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-temple-red-600" />
                  <p className="font-medium">訂單管理</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/temple-admin/lanterns">
              <Card className="border-2 border-temple-gold-200 hover:border-temple-gold-400 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-temple-red-600" />
                  <p className="font-medium">燈種管理</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/temple-admin/events">
              <Card className="border-2 border-temple-gold-200 hover:border-temple-gold-400 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-temple-red-600" />
                  <p className="font-medium">法會管理</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/temple-admin/reports">
              <Card className="border-2 border-temple-gold-200 hover:border-temple-gold-400 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-temple-red-600" />
                  <p className="font-medium">統計報表</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
