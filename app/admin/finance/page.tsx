'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Download, TrendingUp } from 'lucide-react'
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
      // TODO: 實作財務報表 API
      // const res = await fetch(`/api/admin/finance?range=${dateRange}`)
      // if (res.ok) {
      //   const data = await res.json()
      //   setFinancialData(data)
      // }

      // 暫時設為空資料
      setFinancialData({
        totalRevenue: 0,
        monthlyRevenue: 0,
        platformFee: 0,
        monthlyPlatformFee: 0,
        pendingSettlement: 0,
        settledAmount: 0,
        feeRate: 5,
      })
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
                          ${financialData?.totalRevenue?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          待實作 API
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-blue-600" />
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
                          ${financialData?.platformFee?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          抽成比例：{financialData?.feeRate || 5}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-temple-red-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-temple-red-600" />
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
                          ${financialData?.pendingSettlement?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          待實作 API
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
                          ${financialData?.settledAmount?.toLocaleString() || 0}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          待實作 API
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

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">ℹ️</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-900 mb-2">財務報表功能</h3>
                    <p className="text-blue-800 text-sm">
                      財務報表功能需要實作 <code className="px-2 py-1 bg-blue-100 rounded">/api/admin/finance</code> API 來獲取真實的財務數據。
                      包括營收統計、平台抽成、結算記錄等功能。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
