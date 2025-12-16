'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  User, ShoppingBag, Heart, Settings, LogOut, 
  Edit, ChevronRight, Flame, Calendar, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'
import { useUserStore } from '@/lib/store'

// 模擬用戶資料
const mockUser = {
  name: '王大明',
  email: 'wang@example.com',
  phone: '0912-345-678',
  memberSince: '2024-01-15',
  avatar: null,
}

// 模擬訂單
const mockOrders = [
  {
    id: 'TL2024121001',
    date: '2024-12-10',
    temple: '艋舺龍山寺',
    lantern: '光明燈',
    amount: 1200,
    status: 'completed',
  },
  {
    id: 'TL2024120901',
    date: '2024-12-09',
    temple: '臺北行天宮',
    lantern: '財神燈',
    amount: 1800,
    status: 'processing',
  },
]

// 模擬點燈記錄
const mockLanterns = [
  {
    id: 1,
    temple: '艋舺龍山寺',
    lantern: '光明燈',
    believer: '王大明',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    active: true,
  },
  {
    id: 2,
    temple: '臺北行天宮',
    lantern: '平安燈',
    believer: '王小美',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    active: true,
  },
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const setUser = useUserStore((state) => state.setUser)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    setUser(null)
    window.location.href = '/'
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
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
            {/* Avatar */}
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl">
              {mockUser.avatar || '👤'}
            </div>
            <div>
              <h1 className="text-3xl font-temple font-bold">
                {mockUser.name}
              </h1>
              <p className="opacity-80">{mockUser.email}</p>
              <p className="text-sm opacity-60 mt-1">
                會員自 {mockUser.memberSince}
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
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
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
                    <div className="text-3xl font-bold text-temple-red-700">{mockLanterns.length}</div>
                    <div className="text-gray-600 text-sm">點燈數</div>
                  </Card>
                  <Card className="text-center py-6">
                    <div className="text-4xl mb-2">📋</div>
                    <div className="text-3xl font-bold text-temple-red-700">{mockOrders.length}</div>
                    <div className="text-gray-600 text-sm">訂單數</div>
                  </Card>
                  <Card className="text-center py-6">
                    <div className="text-4xl mb-2">🙏</div>
                    <div className="text-3xl font-bold text-temple-red-700">12</div>
                    <div className="text-gray-600 text-sm">祈福次數</div>
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
                    {mockLanterns.filter(l => l.active).map((lantern) => (
                      <div key={lantern.id} className="flex items-center justify-between p-4 bg-temple-gold-50 rounded-lg mb-3 last:mb-0">
                        <div className="flex items-center gap-4">
                          <Lantern size="sm" color="red" animate={false} />
                          <div>
                            <div className="font-medium text-temple-red-800">
                              {lantern.temple} - {lantern.lantern}
                            </div>
                            <div className="text-sm text-gray-600">
                              信眾：{lantern.believer}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-gray-500">有效期限</div>
                          <div className="font-medium">{lantern.endDate}</div>
                        </div>
                      </div>
                    ))}
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
                    {mockOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <div className="font-mono text-sm text-gray-500">{order.id}</div>
                          <div className="font-medium">{order.temple} - {order.lantern}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">NT$ {order.amount.toLocaleString()}</div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    ))}
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
                    {mockOrders.map((order) => (
                      <Link key={order.id} href={`/orders/${order.id}`}>
                        <div className="flex items-center justify-between p-4 border rounded-lg mb-3 hover:border-temple-gold-400 hover:shadow-md transition-all">
                          <div>
                            <div className="font-mono text-sm text-gray-500">{order.id}</div>
                            <div className="font-medium">{order.temple}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4" />
                              {order.date}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-temple-red-700">NT$ {order.amount.toLocaleString()}</div>
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                      </Link>
                    ))}
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
                    {mockLanterns.map((lantern) => (
                      <div key={lantern.id} className="p-4 border rounded-lg mb-3 hover:border-temple-gold-400 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                              <Lantern size="sm" color="gold" animate={false} />
                            </div>
                            <div>
                              <div className="font-bold text-temple-red-800">{lantern.lantern}</div>
                              <div className="text-sm text-gray-600">{lantern.temple}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                信眾：{lantern.believer}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              lantern.active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {lantern.active ? '燈火長明中' : '已結束'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">開始日期：</span>
                            <span>{lantern.startDate}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">結束日期：</span>
                            <span>{lantern.endDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                          defaultValue={mockUser.name}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">電子郵件</label>
                        <input
                          type="email"
                          defaultValue={mockUser.email}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">手機號碼</label>
                        <input
                          type="tel"
                          defaultValue={mockUser.phone}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
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





