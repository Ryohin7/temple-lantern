'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, Building2, Users, DollarSign, ShoppingBag, FileText,
  TrendingUp, Settings, LogOut, Bell, Eye, CheckCircle, XCircle,
  BarChart3, Calendar, Flame, AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬統計資料
const mockStats = {
  totalRevenue: 2456800,
  monthlyRevenue: 387600,
  totalOrders: 1856,
  monthlyOrders: 245,
  totalTemples: 28,
  activeTemples: 24,
  totalUsers: 5680,
  newUsersThisMonth: 342,
  platformFee: 245680, // 10% 平台費
  pendingApprovals: 3,
}

// 模擬待審核廟宇
const mockPendingTemples = [
  { id: 1, name: '新竹城隍廟', applicant: '陳志明', date: '2024-12-08', status: 'pending' },
  { id: 2, name: '彰化南瑤宮', applicant: '林美玲', date: '2024-12-09', status: 'pending' },
  { id: 3, name: '嘉義朝天宮', applicant: '王建國', date: '2024-12-10', status: 'pending' },
]

// 模擬最新訂單
const mockRecentOrders = [
  { id: 'TL2024121001', temple: '艋舺龍山寺', amount: 3200, date: '2024-12-10 14:30' },
  { id: 'TL2024121002', temple: '臺北行天宮', amount: 1800, date: '2024-12-10 15:20' },
  { id: 'TL2024121003', temple: '大甲鎮瀾宮', amount: 5600, date: '2024-12-10 16:45' },
  { id: 'TL2024121004', temple: '臺北霞海城隍廟', amount: 1500, date: '2024-12-10 17:10' },
]

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-temple-gold-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">台灣點燈網</h1>
              <p className="text-sm text-gray-400">系統管理後台</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <LogOut className="w-4 h-4 mr-2" />
                登出
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-8">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { icon: <BarChart3 className="w-5 h-5" />, label: '總覽', href: '/admin/dashboard', active: true },
                    { icon: <Building2 className="w-5 h-5" />, label: '廟宇管理', href: '/admin/temples' },
                    { icon: <Users className="w-5 h-5" />, label: '用戶管理', href: '/admin/users' },
                    { icon: <ShoppingBag className="w-5 h-5" />, label: '訂單管理', href: '/admin/orders' },
                    { icon: <Calendar className="w-5 h-5" />, label: '法會活動', href: '/admin/events' },
                    { icon: <FileText className="w-5 h-5" />, label: '內容管理', href: '/admin/content' },
                    { icon: <Settings className="w-5 h-5" />, label: '系統設定', href: '/admin/settings' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        item.active
                          ? 'bg-temple-gold-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-green-100 text-sm">平台總營收</div>
                        <div className="text-2xl font-bold text-white">
                          ${mockStats.totalRevenue.toLocaleString()}
                        </div>
                        <div className="text-green-200 text-xs mt-1">
                          本月 ${mockStats.monthlyRevenue.toLocaleString()}
                        </div>
                      </div>
                      <DollarSign className="w-10 h-10 text-green-200 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-blue-100 text-sm">總訂單數</div>
                        <div className="text-2xl font-bold text-white">
                          {mockStats.totalOrders.toLocaleString()}
                        </div>
                        <div className="text-blue-200 text-xs mt-1">
                          本月 {mockStats.monthlyOrders} 筆
                        </div>
                      </div>
                      <ShoppingBag className="w-10 h-10 text-blue-200 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-purple-100 text-sm">合作廟宇</div>
                        <div className="text-2xl font-bold text-white">
                          {mockStats.totalTemples}
                        </div>
                        <div className="text-purple-200 text-xs mt-1">
                          {mockStats.activeTemples} 間上線中
                        </div>
                      </div>
                      <Building2 className="w-10 h-10 text-purple-200 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-orange-100 text-sm">註冊用戶</div>
                        <div className="text-2xl font-bold text-white">
                          {mockStats.totalUsers.toLocaleString()}
                        </div>
                        <div className="text-orange-200 text-xs mt-1">
                          本月新增 {mockStats.newUsersThisMonth}
                        </div>
                      </div>
                      <Users className="w-10 h-10 text-orange-200 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Platform Fee */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-temple-gold-600/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-temple-gold-400" />
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">平台服務費收入 (10%)</div>
                        <div className="text-3xl font-bold text-temple-gold-400">
                          NT$ {mockStats.platformFee.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Link href="/admin/finance">
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        查看財務報表
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      待審核廟宇
                      <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">
                        {mockPendingTemples.length}
                      </span>
                    </CardTitle>
                    <Link href="/admin/temples?status=pending">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        查看全部
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockPendingTemples.map((temple) => (
                        <div key={temple.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-temple-gradient rounded-lg flex items-center justify-center">
                              <Lantern size="sm" color="gold" animate={false} />
                            </div>
                            <div>
                              <div className="font-medium text-white">{temple.name}</div>
                              <div className="text-xs text-gray-400">
                                申請人：{temple.applicant} | {temple.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="text-green-500 hover:bg-green-500/20">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/20">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Orders */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-blue-500" />
                      最新訂單
                    </CardTitle>
                    <Link href="/admin/orders">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        查看全部
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockRecentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div>
                            <div className="font-mono text-sm text-gray-400">{order.id}</div>
                            <div className="font-medium text-white">{order.temple}</div>
                            <div className="text-xs text-gray-500">{order.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-temple-gold-400">
                              NT$ {order.amount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">快速操作</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/content">
                      <div className="p-4 bg-gray-700/50 rounded-lg text-center hover:bg-gray-700 transition-colors cursor-pointer">
                        <FileText className="w-8 h-8 text-temple-gold-400 mx-auto mb-2" />
                        <div className="text-white text-sm">編輯頁面內容</div>
                      </div>
                    </Link>
                    <Link href="/admin/events/new">
                      <div className="p-4 bg-gray-700/50 rounded-lg text-center hover:bg-gray-700 transition-colors cursor-pointer">
                        <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <div className="text-white text-sm">新增法會活動</div>
                      </div>
                    </Link>
                    <Link href="/admin/temples">
                      <div className="p-4 bg-gray-700/50 rounded-lg text-center hover:bg-gray-700 transition-colors cursor-pointer">
                        <Building2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <div className="text-white text-sm">管理廟宇</div>
                      </div>
                    </Link>
                    <Link href="/admin/settings">
                      <div className="p-4 bg-gray-700/50 rounded-lg text-center hover:bg-gray-700 transition-colors cursor-pointer">
                        <Settings className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-white text-sm">系統設定</div>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

