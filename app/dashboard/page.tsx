'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User, ShoppingBag, Settings, LogOut,
  ChevronRight, Flame, Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'
import { useUserStore } from '@/lib/store'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [lanterns, setLanterns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const clearUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    setMounted(true)
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)

      // 獲取當前用戶
      const { getCurrentUser } = await import('@/lib/auth')
      const currentUser = await getCurrentUser()

      if (currentUser) {
        setUser(currentUser)

        // 獲取用戶訂單
        const ordersRes = await fetch('/api/orders')
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(ordersData)
        }

        // 獲取用戶點燈記錄
        const lanternsRes = await fetch('/api/user/lanterns')
        if (lanternsRes.ok) {
          const lanternsData = await ordersRes.json()
          setLanterns(lanternsData)
        }
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const { signOut } = await import('@/lib/auth')
    await signOut()
    clearUser(null)
    window.location.href = '/'
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">請先登入</p>
          <Button onClick={() => window.location.href = '/login'}>前往登入</Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">已完成</span>
      case 'processing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">處理中</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">待處理</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      {/* Header */}
      <section className="bg-temple-gradient py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white flex items-center gap-6"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-temple font-bold">
                {user.name || '用戶'}
              </h1>
              <p className="opacity-80">{user.email}</p>
              <p className="text-sm opacity-60 mt-1">
                會員自 {new Date(user.created_at || Date.now()).toLocaleDateString('zh-TW')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'overview', icon: <User className="w-5 h-5" />, label: '會員總覽' },
                    { id: 'orders', icon: <ShoppingBag className="w-5 h-5" />, label: '訂單紀錄' },
                    { id: 'lanterns', icon: <Flame className="w-5 h-5" />, label: '點燈紀錄' },
                    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: '帳號設定' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                          ? 'bg-temple-red-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <hr className="my-4" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    登出
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="text-center py-6">
                    <div className="text-4xl mb-2">🏮</div>
                    <div className="text-3xl font-bold text-temple-red-700">{lanterns.length}</div>
                    <div className="text-gray-600 text-sm">點燈數</div>
                  </Card>
                  <Card className="text-center py-6">
                    <div className="text-4xl mb-2">📋</div>
                    <div className="text-3xl font-bold text-temple-red-700">{orders.length}</div>
                    <div className="text-gray-600 text-sm">訂單數</div>
                  </Card>
                  <Card className="text-center py-6">
                    <div className="text-4xl mb-2">🙏</div>
                    <div className="text-3xl font-bold text-temple-red-700">
                      {lanterns.filter((l: any) => l.active).length}
                    </div>
                    <div className="text-gray-600 text-sm">進行中</div>
                  </Card>
                </div>

                {/* Active Lanterns */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Flame className="w-5 h-5 text-temple-red-600" />
                      進行中的點燈
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('lanterns')}>
                      查看全部
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {lanterns.filter((l: any) => l.active).length === 0 ? (
                      <p className="text-gray-500 text-center py-4">目前沒有進行中的點燈</p>
                    ) : (
                      lanterns.filter((l: any) => l.active).map((lantern: any) => (
                        <div key={lantern.id} className="flex items-center justify-between p-4 bg-temple-gold-50 rounded-lg mb-3 last:mb-0">
                          <div className="flex items-center gap-4">
                            <Lantern size="sm" color="red" animate={false} />
                            <div>
                              <div className="font-medium text-temple-red-800">
                                {lantern.temple} - {lantern.lantern}
                              </div>
                              <div className="text-sm text-gray-600">
                                信眾：{lantern.believer_name}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-gray-500">有效期限</div>
                            <div className="font-medium">{lantern.expiry_date}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">最近訂單</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                      查看全部
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">目前沒有訂單記錄</p>
                    ) : (
                      orders.slice(0, 3).map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                          <div>
                            <div className="font-mono text-sm text-gray-500">{order.id}</div>
                            <div className="font-medium">{order.temples?.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">NT$ {order.total_amount?.toLocaleString()}</div>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">訂單紀錄</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">目前沒有訂單記錄</p>
                    ) : (
                      orders.map((order: any) => (
                        <Link key={order.id} href={`/orders/${order.id}`}>
                          <div className="flex items-center justify-between p-4 border rounded-lg mb-3 hover:border-temple-gold-400 hover:shadow-md transition-all">
                            <div>
                              <div className="font-mono text-sm text-gray-500">{order.id}</div>
                              <div className="font-medium">{order.temples?.name}</div>
                              <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.created_at).toLocaleDateString('zh-TW')}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-temple-red-700">
                                NT$ {order.total_amount?.toLocaleString()}
                              </div>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Lanterns Tab */}
            {activeTab === 'lanterns' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">點燈紀錄</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lanterns.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">目前沒有點燈記錄</p>
                    ) : (
                      lanterns.map((lantern: any) => (
                        <div key={lantern.id} className="p-4 border rounded-lg mb-3 hover:border-temple-gold-400 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                                <Lantern size="sm" color="gold" animate={false} />
                              </div>
                              <div>
                                <div className="font-bold text-temple-red-800">{lantern.lantern_name}</div>
                                <div className="text-sm text-gray-600">{lantern.temple_name}</div>
                                <div className="text-sm text-gray-500 mt-1">
                                  信眾：{lantern.believer_name}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-sm ${lantern.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                                }`}>
                                {lantern.active ? '燈火長明中' : '已結束'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">帳號設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">姓名</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">電子郵件</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="temple">儲存變更</Button>
                      <Button variant="outline" className="border-temple-gold-400">
                        修改密碼
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
