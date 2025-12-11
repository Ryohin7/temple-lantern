'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, TrendingUp, DollarSign, ShoppingBag, Users, 
  Calendar, Download, ChevronDown, Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬統計資料
const mockStats = {
  totalRevenue: 456800,
  monthlyRevenue: 87600,
  totalOrders: 312,
  monthlyOrders: 45,
  avgOrderValue: 1465,
  growthRate: 12.5,
}

// 模擬月度資料
const mockMonthlyData = [
  { month: '1月', revenue: 35000, orders: 28 },
  { month: '2月', revenue: 42000, orders: 35 },
  { month: '3月', revenue: 38000, orders: 31 },
  { month: '4月', revenue: 55000, orders: 42 },
  { month: '5月', revenue: 48000, orders: 38 },
  { month: '6月', revenue: 62000, orders: 48 },
  { month: '7月', revenue: 58000, orders: 45 },
  { month: '8月', revenue: 72000, orders: 55 },
  { month: '9月', revenue: 68000, orders: 52 },
  { month: '10月', revenue: 75000, orders: 58 },
  { month: '11月', revenue: 82000, orders: 63 },
  { month: '12月', revenue: 87600, orders: 45 },
]

// 模擬燈種銷售排行
const mockLanternRanking = [
  { name: '光明燈', sold: 125, revenue: 150000, percentage: 32.8 },
  { name: '平安燈', sold: 98, revenue: 98000, percentage: 21.5 },
  { name: '財神燈', sold: 76, revenue: 136800, percentage: 30.0 },
  { name: '月老燈', sold: 45, revenue: 67500, percentage: 14.8 },
  { name: '文昌燈', sold: 8, revenue: 4500, percentage: 0.9 },
]

export default function TempleReportsPage() {
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState('thisMonth')

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

  const maxRevenue = Math.max(...mockMonthlyData.map(d => d.revenue))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-temple-gradient text-white py-6 px-6">
        <div className="container mx-auto">
          <Link
            href="/temple-admin/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回後台
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-temple font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                統計報表
              </h1>
              <p className="text-white/80 text-sm mt-1">查看廟宇營收與訂單統計</p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/30 text-white text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="thisMonth" className="text-gray-900">本月</option>
                <option value="lastMonth" className="text-gray-900">上月</option>
                <option value="thisYear" className="text-gray-900">今年</option>
                <option value="custom" className="text-gray-900">自訂範圍</option>
              </select>
              <Button variant="gold">
                <Download className="w-4 h-4 mr-2" />
                匯出報表
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">總營收</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${mockStats.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      +{mockStats.growthRate}%
                    </div>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">本月營收</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${mockStats.monthlyRevenue.toLocaleString()}
                    </div>
                  </div>
                  <Calendar className="w-10 h-10 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">總訂單數</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {mockStats.totalOrders}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      本月 {mockStats.monthlyOrders} 筆
                    </div>
                  </div>
                  <ShoppingBag className="w-10 h-10 text-purple-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">平均訂單金額</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${mockStats.avgOrderValue.toLocaleString()}
                    </div>
                  </div>
                  <Users className="w-10 h-10 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Monthly Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">月度營收趨勢</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {mockMonthlyData.map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-temple-gradient rounded-t transition-all hover:opacity-80"
                        style={{ 
                          height: `${(data.revenue / maxRevenue) * 200}px`,
                        }}
                        title={`$${data.revenue.toLocaleString()}`}
                      />
                      <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lantern Ranking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-temple-red-600" />
                  燈種銷售排行
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLanternRanking.map((lantern, i) => (
                    <div key={lantern.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-yellow-100 text-yellow-700' :
                            i === 1 ? 'bg-gray-100 text-gray-700' :
                            i === 2 ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-50 text-gray-500'
                          }`}>
                            {i + 1}
                          </span>
                          <span className="font-medium">{lantern.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {lantern.sold} 盞
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-temple-gradient"
                            style={{ width: `${lantern.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-16 text-right">
                          ${(lantern.revenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Monthly Detail Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">月度明細</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">月份</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">訂單數</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">營收</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">平均客單</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">成長率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMonthlyData.map((data, i) => {
                      const prevRevenue = i > 0 ? mockMonthlyData[i - 1].revenue : data.revenue
                      const growth = ((data.revenue - prevRevenue) / prevRevenue * 100).toFixed(1)
                      const avgOrder = Math.round(data.revenue / data.orders)
                      
                      return (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{data.month}</td>
                          <td className="py-3 px-4 text-right">{data.orders}</td>
                          <td className="py-3 px-4 text-right font-medium">
                            ${data.revenue.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-600">
                            ${avgOrder.toLocaleString()}
                          </td>
                          <td className={`py-3 px-4 text-right ${
                            Number(growth) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {Number(growth) >= 0 ? '+' : ''}{growth}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-bold">
                      <td className="py-3 px-4">總計</td>
                      <td className="py-3 px-4 text-right">
                        {mockMonthlyData.reduce((sum, d) => sum + d.orders, 0)}
                      </td>
                      <td className="py-3 px-4 text-right text-temple-red-700">
                        ${mockMonthlyData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">-</td>
                      <td className="py-3 px-4 text-right">-</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}


