'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, Download, LogOut,
  TrendingUp, TrendingDown, Percent, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance', active: true },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

// 財務數據
const financialData = {
  totalRevenue: 2567800,
  monthlyRevenue: 456000,
  platformFee: 128390,
  monthlyPlatformFee: 22800,
  pendingSettlement: 45600,
  settledAmount: 82790,
  feeRate: 5,
}

// 月份營收趨勢
const monthlyTrend = [
  { month: '7月', revenue: 198000, fee: 9900 },
  { month: '8月', revenue: 256000, fee: 12800 },
  { month: '9月', revenue: 312000, fee: 15600 },
  { month: '10月', revenue: 389000, fee: 19450 },
  { month: '11月', revenue: 423000, fee: 21150 },
  { month: '12月', revenue: 456000, fee: 22800 },
]

// 廟宇收入排行
const templeRanking = [
  { rank: 1, name: '大甲鎮瀾宮', revenue: 813600, orders: 678 },
  { rank: 2, name: '艋舺龍山寺', revenue: 547200, orders: 456 },
  { rank: 3, name: '臺北行天宮', revenue: 467000, orders: 389 },
  { rank: 4, name: '南鯤鯓代天府', revenue: 356000, orders: 298 },
  { rank: 5, name: '霞海城隍廟', revenue: 289000, orders: 241 },
]

export default function AdminFinancePage() {
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState('month')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExport = () => {
    alert('正在匯出財務報表...')
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
                  <DollarSign className="w-6 h-6 text-temple-red-600" />
                  財務報表
                </h1>
                <p className="text-gray-500 text-sm">平台收入與財務統計</p>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="week">本週</option>
                  <option value="month">本月</option>
                  <option value="quarter">本季</option>
                  <option value="year">今年</option>
                </select>
                <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  匯出報表
                </Button>
              </div>
            </div>
          </header>

          <div className="p-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">平台總營收</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${financialData.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                          <TrendingUp className="w-4 h-4" />
                          +15.3% 較上月
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
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
                <Card className="border-l-4 border-l-temple-red-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">平台抽成收入</p>
                        <p className="text-2xl font-bold text-temple-red-600">
                          ${financialData.platformFee.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          抽成比例：{financialData.feeRate}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-temple-red-100 rounded-full flex items-center justify-center">
                        <Percent className="w-6 h-6 text-temple-red-600" />
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
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">待結算金額</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          ${financialData.pendingSettlement.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          下次結算：12/15
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-yellow-600" />
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
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm">已結算金額</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${financialData.settledAmount.toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          本月已結
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Trend */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">營收趨勢</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {monthlyTrend.map((data, index) => (
                        <div key={data.month} className="flex items-center gap-4">
                          <div className="w-12 text-gray-500 text-sm">{data.month}</div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(data.revenue / 500000) * 100}%` }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-temple-red-500 to-temple-orange-500 rounded-full"
                              />
                            </div>
                          </div>
                          <div className="w-28 text-right">
                            <div className="font-medium text-gray-900">${(data.revenue / 10000).toFixed(1)}萬</div>
                            <div className="text-xs text-temple-red-600">抽成 ${data.fee.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Temple Ranking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">廟宇收入排行</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {templeRanking.map((temple) => (
                        <div key={temple.rank} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            temple.rank === 1 ? 'bg-yellow-500' :
                            temple.rank === 2 ? 'bg-gray-400' :
                            temple.rank === 3 ? 'bg-amber-600' :
                            'bg-gray-300'
                          }`}>
                            {temple.rank}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{temple.name}</div>
                            <div className="text-sm text-gray-500">{temple.orders} 筆訂單</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-temple-red-600">${temple.revenue.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">抽成 ${(temple.revenue * 0.05).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">付款方式統計</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-xl text-center">
                      <div className="text-4xl mb-2">💳</div>
                      <div className="text-2xl font-bold text-blue-600">65%</div>
                      <div className="text-gray-600">信用卡</div>
                      <div className="text-sm text-gray-500 mt-1">$1,669,070</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl text-center">
                      <div className="text-4xl mb-2">🏧</div>
                      <div className="text-2xl font-bold text-green-600">25%</div>
                      <div className="text-gray-600">ATM 轉帳</div>
                      <div className="text-sm text-gray-500 mt-1">$641,950</div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl text-center">
                      <div className="text-4xl mb-2">🏪</div>
                      <div className="text-2xl font-bold text-purple-600">10%</div>
                      <div className="text-gray-600">超商代碼</div>
                      <div className="text-sm text-gray-500 mt-1">$256,780</div>
                    </div>
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




