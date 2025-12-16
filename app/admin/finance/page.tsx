'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Download, TrendingUp, CreditCard, Percent } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminFinancePage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month')
  const [financialData, setFinancialData] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    fetchFinancialData()
  }, [dateRange])

  const fetchFinancialData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/finance?range=${dateRange}`)
      if (res.ok) {
        const data = await res.json()
        setFinancialData(data)
      }
    } catch (error) {
      console.error('Failed to fetch financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    alert('正在匯出財務報表...')
  }

  if (!mounted) return null

  return (
    <AdminLayout>
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
        {loading ? (
          <p className="text-center py-8 text-gray-500">載入中...</p>
        ) : (
          <>
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
                          ${financialData?.stats?.totalRevenue?.toLocaleString() || 0}
                        </p>
                        <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                          <TrendingUp className="w-4 h-4" />
                          期間 ${financialData?.stats?.periodRevenue?.toLocaleString() || 0}
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
                          ${financialData?.stats?.platformFee?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          抽成比例：{financialData?.stats?.feeRate || 5}%
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
                          ${financialData?.stats?.pendingSettlement?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          下次結算：每月15日
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
                          ${financialData?.stats?.settledAmount?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          累計已結
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
                      {financialData?.monthlyTrend?.map((data: any, index: number) => (
                        <div key={data.month} className="flex items-center gap-4">
                          <div className="w-12 text-gray-500 text-sm">{data.month}</div>
                          <div className="flex-1">
                            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((data.revenue / 500000) * 100, 100)}%` }}
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
                      {financialData?.templeRanking?.length > 0 ? (
                        financialData.templeRanking.map((temple: any) => (
                          <div key={temple.rank} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${temple.rank === 1 ? 'bg-yellow-500' :
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
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">暫無數據</p>
                      )}
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
                      <div className="text-2xl font-bold text-blue-600">
                        {financialData?.paymentMethods?.creditCard?.percentage || 0}%
                      </div>
                      <div className="text-gray-600">信用卡</div>
                      <div className="text-sm text-gray-500 mt-1">
                        ${financialData?.paymentMethods?.creditCard?.amount?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl text-center">
                      <div className="text-4xl mb-2">🏧</div>
                      <div className="text-2xl font-bold text-green-600">
                        {financialData?.paymentMethods?.atm?.percentage || 0}%
                      </div>
                      <div className="text-gray-600">ATM 轉帳</div>
                      <div className="text-sm text-gray-500 mt-1">
                        ${financialData?.paymentMethods?.atm?.amount?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-xl text-center">
                      <div className="text-4xl mb-2">🏪</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {financialData?.paymentMethods?.convenience?.percentage || 0}%
                      </div>
                      <div className="text-gray-600">超商代碼</div>
                      <div className="text-sm text-gray-500 mt-1">
                        ${financialData?.paymentMethods?.convenience?.amount?.toLocaleString() || 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
