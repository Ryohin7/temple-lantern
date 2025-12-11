'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Building2, ShoppingBag, Flame, DollarSign, Users, Settings, 
  LogOut, Bell, Plus, TrendingUp, Calendar, Eye, Edit, Trash2, BarChart3, CalendarDays
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬廟宇資料
const mockTemple = {
  name: '艋舺龍山寺',
  mainGod: '觀世音菩薩',
  status: 'active',
}

// 模擬統計資料
const mockStats = {
  totalOrders: 156,
  pendingOrders: 12,
  totalRevenue: 187200,
  monthlyRevenue: 45600,
  totalLanterns: 8,
  activeLanterns: 6,
}

// 模擬訂單
const mockOrders = [
  { id: 'TL001', date: '2024-12-10', customer: '王○明', lantern: '光明燈', amount: 1200, status: 'pending' },
  { id: 'TL002', date: '2024-12-10', customer: '李○華', lantern: '財神燈', amount: 1800, status: 'processing' },
  { id: 'TL003', date: '2024-12-09', customer: '陳○美', lantern: '平安燈', amount: 1000, status: 'completed' },
  { id: 'TL004', date: '2024-12-09', customer: '張○文', lantern: '月老燈', amount: 1500, status: 'completed' },
]

// 模擬燈種
const mockLanterns = [
  { id: 1, name: '光明燈', price: 1200, stock: 100, sales: 45, active: true },
  { id: 2, name: '財神燈', price: 1800, stock: 80, sales: 32, active: true },
  { id: 3, name: '平安燈', price: 1000, stock: 120, sales: 58, active: true },
  { id: 4, name: '月老燈', price: 1500, stock: 60, sales: 21, active: true },
]

// 模擬法會活動
const mockEvents = [
  { 
    id: 1, 
    title: '2025新春祈福法會', 
    date: '2025-01-25', 
    participants: 156, 
    maxParticipants: 300, 
    revenue: 312000,
    status: 'upcoming' 
  },
  { 
    id: 2, 
    title: '元宵節點燈祈福', 
    date: '2025-02-12', 
    participants: 89, 
    maxParticipants: 200, 
    revenue: 133500,
    status: 'upcoming' 
  },
]

export default function TempleAdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-temple-gradient text-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Lantern size="sm" color="gold" animate={false} />
            <div>
              <h1 className="text-xl font-temple font-bold">{mockTemple.name}</h1>
              <p className="text-sm opacity-80">廟宇管理後台</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
              <LogOut className="w-4 h-4" />
              登出
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'overview', icon: <Building2 className="w-5 h-5" />, label: '總覽', href: null },
                    { id: 'orders', icon: <ShoppingBag className="w-5 h-5" />, label: '訂單管理', href: '/temple-admin/orders' },
                    { id: 'lanterns', icon: <Flame className="w-5 h-5" />, label: '燈種管理', href: '/temple-admin/lanterns' },
                    { id: 'events', icon: <CalendarDays className="w-5 h-5" />, label: '法會活動', href: '/temple-admin/events' },
                    { id: 'reports', icon: <BarChart3 className="w-5 h-5" />, label: '統計報表', href: '/temple-admin/reports' },
                    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: '廟宇設定', href: '/temple-admin/settings' },
                  ].map((item) => (
                    item.href ? (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 text-gray-700"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ) : (
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
                    )
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">總訂單數</div>
                          <div className="text-2xl font-bold text-gray-900">{mockStats.totalOrders}</div>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-blue-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">待處理訂單</div>
                          <div className="text-2xl font-bold text-yellow-600">{mockStats.pendingOrders}</div>
                        </div>
                        <Bell className="w-8 h-8 text-yellow-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">總營收</div>
                          <div className="text-2xl font-bold text-green-600">
                            ${mockStats.totalRevenue.toLocaleString()}
                          </div>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500">本月營收</div>
                          <div className="text-2xl font-bold text-purple-600">
                            ${mockStats.monthlyRevenue.toLocaleString()}
                          </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">最新訂單</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                      查看全部
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">訂單編號</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">信眾</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">燈種</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">金額</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">狀態</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                              <td className="py-3 px-4 text-sm">{order.customer}</td>
                              <td className="py-3 px-4 text-sm">{order.lantern}</td>
                              <td className="py-3 px-4 text-sm font-medium">${order.amount}</td>
                              <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Lanterns Summary */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">燈種銷售概況</CardTitle>
                    <Link href="/temple-admin/lanterns">
                      <Button variant="outline" size="sm">
                        管理燈種
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {mockLanterns.map((lantern) => (
                        <div key={lantern.id} className="p-4 bg-temple-gold-50 rounded-lg text-center">
                          <div className="text-2xl mb-2">🏮</div>
                          <div className="font-medium text-temple-red-800">{lantern.name}</div>
                          <div className="text-sm text-gray-600">已售 {lantern.sales} 盞</div>
                          <div className="text-sm text-gray-600">庫存 {lantern.stock}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Events Summary */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-temple-red-600" />
                      法會報名狀況
                    </CardTitle>
                    <Link href="/temple-admin/events">
                      <Button variant="outline" size="sm">
                        管理法會
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {mockEvents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>尚無法會活動</p>
                        <Link href="/temple-admin/events">
                          <Button variant="temple" size="sm" className="mt-4">
                            <Plus className="w-4 h-4 mr-2" />
                            建立法會
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {mockEvents.map((event) => (
                          <div 
                            key={event.id} 
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-temple-gold-50 to-temple-orange-50 rounded-lg border border-temple-gold-200"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-temple-gradient rounded-lg flex items-center justify-center text-2xl">
                                🙏
                              </div>
                              <div>
                                <div className="font-bold text-temple-red-800">{event.title}</div>
                                <div className="text-sm text-gray-600 flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {event.date}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-temple-red-700">
                                {event.participants} / {event.maxParticipants} 人
                              </div>
                              <div className="text-sm text-gray-500">
                                營收 ${event.revenue.toLocaleString()}
                              </div>
                              <div className="w-32 h-2 bg-gray-200 rounded-full mt-2">
                                <div 
                                  className="h-full bg-temple-gradient rounded-full"
                                  style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">訂單管理</CardTitle>
                    <div className="flex gap-2">
                      <select className="px-3 py-2 border rounded-lg text-sm">
                        <option>全部狀態</option>
                        <option>待處理</option>
                        <option>處理中</option>
                        <option>已完成</option>
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">訂單編號</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">日期</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">信眾</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">燈種</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">金額</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">狀態</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockOrders.map((order) => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                              <td className="py-3 px-4 text-sm">{order.customer}</td>
                              <td className="py-3 px-4 text-sm">{order.lantern}</td>
                              <td className="py-3 px-4 text-sm font-medium">${order.amount}</td>
                              <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {order.status === 'pending' && (
                                    <Button variant="temple" size="sm">
                                      確認點燈
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">燈種管理</CardTitle>
                    <Button variant="temple">
                      <Plus className="w-4 h-4 mr-2" />
                      新增燈種
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {mockLanterns.map((lantern) => (
                        <div
                          key={lantern.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-temple-gold-100 rounded-lg flex items-center justify-center">
                              <Lantern size="sm" color="red" animate={false} />
                            </div>
                            <div>
                              <div className="font-bold text-temple-red-800">{lantern.name}</div>
                              <div className="text-sm text-gray-600">
                                價格：NT$ {lantern.price.toLocaleString()} / 年
                              </div>
                              <div className="text-sm text-gray-600">
                                庫存：{lantern.stock} | 已售：{lantern.sales}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              lantern.active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {lantern.active ? '上架中' : '已下架'}
                            </span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Temple Settings Tab */}
            {activeTab === 'temple' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">廟宇設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">廟宇名稱</label>
                        <input
                          type="text"
                          defaultValue={mockTemple.name}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">主祀神明</label>
                        <input
                          type="text"
                          defaultValue={mockTemple.mainGod}
                          className="mt-1 w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">廟宇簡介</label>
                        <textarea
                          className="mt-1 w-full px-3 py-2 border rounded-lg min-h-[100px]"
                          placeholder="輸入廟宇簡介..."
                        />
                      </div>
                    </div>
                    <Button variant="temple">儲存變更</Button>
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

