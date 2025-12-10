'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, TrendingUp, Settings, Image, CalendarDays,
  ChevronRight, LogOut, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬統計資料
const stats = {
  totalRevenue: 2567800,
  monthlyRevenue: 456000,
  totalOrders: 1523,
  monthlyOrders: 289,
  totalTemples: 45,
  activeTemples: 42,
  totalUsers: 8956,
  newUsers: 234,
  platformFee: 128390,
}

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard', active: true },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

// 最近訂單
const recentOrders = [
  { id: 'ORD-001', temple: '艋舺龍山寺', amount: 2400, status: 'completed', date: '2024-12-10' },
  { id: 'ORD-002', temple: '大甲鎮瀾宮', amount: 1800, status: 'pending', date: '2024-12-10' },
  { id: 'ORD-003', temple: '臺北行天宮', amount: 3200, status: 'completed', date: '2024-12-09' },
  { id: 'ORD-004', temple: '霞海城隍廟', amount: 1500, status: 'lighting', date: '2024-12-09' },
]

// 待審核廟宇
const pendingTemples = [
  { id: 1, name: '新竹城隍廟', city: '新竹市', applyDate: '2024-12-08' },
  { id: 2, name: '彰化南瑤宮', city: '彰化縣', applyDate: '2024-12-09' },
]

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Lantern size="sm" color="red" animate />
              <div>
                <h1 className="font-temple font-bold text-temple-red-700">台灣點燈網</h1>
                <p className="text-xs text-gray-500">管理後台</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-temple-red-50 text-temple-red-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-temple-red-600">
                <LogOut className="w-5 h-5 mr-3" />
                登出系統
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">系統儀表板</h1>
                <p className="text-gray-500 text-sm">歡迎回來，管理員</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-temple-red-600 text-white rounded-full text-xs flex items-center justify-center">
                    3
                  </span>
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-temple-gradient rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">系統管理員</div>
                    <div className="text-xs text-gray-500">admin@temple-lantern.tw</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-temple-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">總營收</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${stats.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                          <TrendingUp className="w-4 h-4" />
                          +12.5%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-temple-red-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-temple-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">總訂單數</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalOrders.toLocaleString()}
                        </p>
                        <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                          <TrendingUp className="w-4 h-4" />
                          +8.3%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">合作廟宇</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalTemples}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {stats.activeTemples} 間上線中
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">註冊用戶</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalUsers.toLocaleString()}
                        </p>
                        <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                          +{stats.newUsers} 本月新增
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Platform Fee Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-temple-red-600 to-temple-orange-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="opacity-90">本月平台收入（5% 抽成）</p>
                      <p className="text-4xl font-bold mt-2">
                        ${stats.platformFee.toLocaleString()}
                      </p>
                    </div>
                    <Link href="/admin/finance">
                      <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                        查看詳情
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">最近訂單</CardTitle>
                    <Link href="/admin/orders">
                      <Button variant="ghost" size="sm" className="text-temple-red-600">
                        查看全部
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{order.id}</div>
                            <div className="text-sm text-gray-500">{order.temple}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">${order.amount.toLocaleString()}</div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                              order.status === 'completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status === 'completed' ? '已完成' :
                               order.status === 'pending' ? '待處理' : '點燈中'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pending Temples */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">待審核廟宇</CardTitle>
                    <Link href="/admin/temples">
                      <Button variant="ghost" size="sm" className="text-temple-red-600">
                        查看全部
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {pendingTemples.length > 0 ? (
                      <div className="space-y-4">
                        {pendingTemples.map((temple) => (
                          <div key={temple.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-temple-gradient rounded-lg flex items-center justify-center">
                                <Lantern size="sm" color="gold" animate={false} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{temple.name}</div>
                                <div className="text-sm text-gray-500">{temple.city} · {temple.applyDate}</div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                核准
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                                駁回
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        目前沒有待審核的廟宇
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">快速操作</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/temples">
                      <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:bg-temple-gold-50 hover:border-temple-gold-300">
                        <Building2 className="w-8 h-8 text-temple-red-600" />
                        <span>管理廟宇</span>
                      </Button>
                    </Link>
                    <Link href="/admin/orders">
                      <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:bg-temple-gold-50 hover:border-temple-gold-300">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                        <span>查看訂單</span>
                      </Button>
                    </Link>
                    <Link href="/admin/banners">
                      <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:bg-temple-gold-50 hover:border-temple-gold-300">
                        <Image className="w-8 h-8 text-green-600" />
                        <span>廣告設定</span>
                      </Button>
                    </Link>
                    <Link href="/admin/settings">
                      <Button variant="outline" className="w-full h-auto py-6 flex flex-col gap-2 hover:bg-temple-gold-50 hover:border-temple-gold-300">
                        <Settings className="w-8 h-8 text-purple-600" />
                        <span>系統設定</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
