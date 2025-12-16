'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Clock, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminTemplesPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [temples, setTemples] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('temples')

  useEffect(() => {
    setMounted(true)
    fetchTemples()
    fetchApplications()
  }, [])

  const fetchTemples = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/temples')
      if (res.ok) {
        const data = await res.json()
        setTemples(data)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/temple-applications')
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    }
  }

  const handleApprove = async (applicationId: string) => {
    if (!confirm('確定要批准此申請嗎？')) return

    try {
      const res = await fetch('/api/admin/temple-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: 'approved' }),
      })

      if (res.ok) {
        alert('申請已批准！')
        fetchApplications()
        fetchTemples()
      } else {
        alert('操作失敗')
      }
    } catch (error) {
      console.error('Failed to approve:', error)
      alert('操作失敗')
    }
  }

  const handleReject = async (applicationId: string) => {
    const reason = prompt('請輸入拒絕原因：')
    if (!reason) return

    try {
      const res = await fetch('/api/admin/temple-applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: 'rejected', rejectionReason: reason }),
      })

      if (res.ok) {
        alert('申請已拒絕')
        fetchApplications()
      } else {
        alert('操作失敗')
      }
    } catch (error) {
      console.error('Failed to reject:', error)
      alert('操作失敗')
    }
  }

  const filteredTemples = temples.filter(temple =>
    temple.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingApplications = applications.filter(app => app.status === 'pending')
  const reviewedApplications = applications.filter(app => app.status !== 'pending')

  if (!mounted) return null

  return (
    <AdminLayout>
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">廟宇管理</h1>
            <p className="text-gray-500 text-sm">管理廟宇資料與申請審核</p>
          </div>
          {pendingApplications.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{pendingApplications.length} 個待審核申請</span>
            </div>
          )}
        </div>
      </header>

      <div className="p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="temples">已上架廟宇</TabsTrigger>
            <TabsTrigger value="pending">
              待審核申請
              {pendingApplications.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs">
                  {pendingApplications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviewed">已審核</TabsTrigger>
          </TabsList>

          {/* 已上架廟宇 */}
          <TabsContent value="temples">
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="搜尋廟宇..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="col-span-full text-center py-8 text-gray-500">載入中...</p>
              ) : filteredTemples.length === 0 ? (
                <p className="col-span-full text-center py-8 text-gray-500">沒有找到廟宇</p>
              ) : (
                filteredTemples.map((temple) => (
                  <Card key={temple.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2">{temple.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">{temple.city}</p>
                      <p className="text-sm text-gray-600 mb-4">{temple.address}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-2" />
                          編輯
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* 待審核申請 */}
          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingApplications.length === 0 ? (
                <Card className="p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700">沒有待審核的申請</h3>
                  <p className="text-gray-500 mt-1">所有申請都已處理完畢</p>
                </Card>
              ) : (
                pendingApplications.map((app) => (
                  <Card key={app.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-bold text-lg">{app.temple_name}</h3>
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              待審核
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-gray-500">主祀神明</p>
                              <p className="font-medium">{app.main_god}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">聯絡電話</p>
                              <p className="font-medium">{app.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">地址</p>
                              <p className="font-medium">{app.address}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">管理員</p>
                              <p className="font-medium">{app.admin_name}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            申請時間：{new Date(app.created_at).toLocaleString('zh-TW')}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleApprove(app.id)}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            批准
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleReject(app.id)}
                          >
                            <X className="w-4 h-4 mr-2" />
                            拒絕
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* 已審核 */}
          <TabsContent value="reviewed">
            <div className="space-y-4">
              {reviewedApplications.length === 0 ? (
                <p className="text-center py-8 text-gray-500">沒有已審核的申請</p>
              ) : (
                reviewedApplications.map((app) => (
                  <Card key={app.id} className={`border-l-4 ${app.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-lg">{app.temple_name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${app.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                              }`}>
                              {app.status === 'approved' ? '已批准' : '已拒絕'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{app.address}</p>
                          {app.rejection_reason && (
                            <p className="text-sm text-red-600">拒絕原因：{app.rejection_reason}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            審核時間：{new Date(app.reviewed_at).toLocaleString('zh-TW')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
