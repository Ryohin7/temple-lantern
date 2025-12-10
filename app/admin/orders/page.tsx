'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, Search, 
  Eye, Download, LogOut, Clock, CheckCircle, Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders', active: true },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

// 模擬訂單資料
const mockOrders = [
  {
    id: 'ORD-2024120001',
    user: '王大明',
    temple: '艋舺龍山寺',
    lanterns: [{ name: '光明燈', quantity: 2 }],
    amount: 2400,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-12-10 14:30',
  },
  {
    id: 'ORD-2024120002',
    user: '李小華',
    temple: '大甲鎮瀾宮',
    lanterns: [{ name: '平安燈', quantity: 1 }, { name: '財神燈', quantity: 1 }],
    amount: 3600,
    status: 'lighting',
    paymentStatus: 'paid',
    createdAt: '2024-12-10 11:20',
  },
  {
    id: 'ORD-2024120003',
    user: '陳美玲',
    temple: '臺北行天宮',
    lanterns: [{ name: '事業燈', quantity: 1 }],
    amount: 1800,
    status: 'pending',
    paymentStatus: 'paid',
    createdAt: '2024-12-10 09:15',
  },
  {
    id: 'ORD-2024120004',
    user: '張建國',
    temple: '霞海城隍廟',
    lanterns: [{ name: '月老燈', quantity: 1 }],
    amount: 1500,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2024-12-09 18:45',
  },
  {
    id: 'ORD-2024120005',
    user: '林雅婷',
    temple: '艋舺龍山寺',
    lanterns: [{ name: '文昌燈', quantity: 3 }],
    amount: 4500,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: '2024-12-09 15:30',
  },
]

export default function AdminOrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredOrders = mockOrders.filter(order => {
    const matchSearch = order.id.includes(searchQuery) || 
      order.user.includes(searchQuery) ||
      order.temple.includes(searchQuery)
    const matchStatus = statusFilter === 'all' || order.status === statusFilter
    return matchSearch && matchStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">已完成</span>
      case 'lighting':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">點燈中</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">待處理</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>
    }
  }

  const getPaymentBadge = (status: string) => {
    if (status === 'paid') {
      return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">已付款</span>
    }
    return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">待付款</span>
  }

  const handleExportCSV = () => {
    alert('正在匯出訂單報表...')
  }

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
          <div className="p-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Lantern size="sm" color="red" animate />
              <div>
                <h1 className="font-temple font-bold text-temple-red-700">台灣點燈網</h1>
                <p className="text-xs text-gray-500">管理後台</p>
              </div>
            </Link>
          </div>

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
          <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6 text-temple-red-600" />
                  訂單管理
                </h1>
                <p className="text-gray-500 text-sm">管理平台所有訂單</p>
              </div>
              <Button onClick={handleExportCSV} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                匯出報表
              </Button>
            </div>
          </header>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900">{mockOrders.length}</div>
                  <div className="text-gray-500">總訂單數</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {mockOrders.filter(o => o.status === 'pending').length}
                  </div>
                  <div className="text-gray-500">待處理</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {mockOrders.filter(o => o.status === 'lighting').length}
                  </div>
                  <div className="text-gray-500">點燈中</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {mockOrders.filter(o => o.status === 'completed').length}
                  </div>
                  <div className="text-gray-500">已完成</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="搜尋訂單編號、用戶或廟宇..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">全部狀態</option>
                    <option value="pending">待處理</option>
                    <option value="lighting">點燈中</option>
                    <option value="completed">已完成</option>
                  </select>
                  <Input
                    type="date"
                    className="w-40"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <span className="self-center text-gray-500">~</span>
                  <Input
                    type="date"
                    className="w-40"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">訂單編號</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">用戶</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">廟宇</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">燈種</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">金額</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">付款</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">狀態</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{order.id}</div>
                          <div className="text-gray-400 text-xs flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {order.createdAt}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900">{order.user}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900">{order.temple}</div>
                        </td>
                        <td className="py-4 px-6">
                          {order.lanterns.map((l, i) => (
                            <div key={i} className="text-gray-700 text-sm">
                              {l.name} x {l.quantity}
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-temple-red-600">${order.amount.toLocaleString()}</div>
                        </td>
                        <td className="py-4 px-6">
                          {getPaymentBadge(order.paymentStatus)}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-4 px-6">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {filteredOrders.length === 0 && (
              <Card className="p-12 text-center mt-4">
                <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">找不到符合條件的訂單</h3>
                <p className="text-gray-500 mt-1">請嘗試其他搜尋條件</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

