'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TempleAdminReportsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/temple-admin/reports')
      if (res.ok) {
        const data = await res.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-temple font-bold text-temple-red-800">統計報表</h1>
          <p className="text-gray-600 mt-2">查看廟宇營運數據</p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-temple-gold-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">本月收入</p>
                  <p className="text-3xl font-bold text-temple-red-700">
                    ${reports?.monthlyRevenue?.toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-temple-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-temple-gold-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">總收入</p>
                  <p className="text-3xl font-bold text-temple-red-700">
                    ${reports?.totalRevenue?.toLocaleString() || 0}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-temple-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-temple-gold-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">平均訂單金額</p>
                  <p className="text-3xl font-bold text-temple-red-700">
                    ${reports?.averageOrderValue?.toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-temple-red-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Lanterns */}
        <Card className="border-2 border-temple-gold-200">
          <CardHeader>
            <CardTitle>熱門燈種</CardTitle>
          </CardHeader>
          <CardContent>
            {reports?.topLanterns?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暫無數據</p>
            ) : (
              <div className="space-y-4">
                {reports?.topLanterns?.map((lantern: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-temple-gold-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-temple-red-700">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{lantern.name}</p>
                        <p className="text-sm text-gray-600">銷售 {lantern.sales} 次</p>
                      </div>
                    </div>
                    <p className="font-bold text-temple-red-700">
                      NT$ {lantern.revenue?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
