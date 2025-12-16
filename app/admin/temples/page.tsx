'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminTemplesPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [temples, setTemples] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchTemples()
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

  const filteredTemples = temples.filter(temple =>
    temple.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) return null

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">廟宇管理</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新增廟宇
          </Button>
        </div>

        {/* Search */}
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

        {/* Temples Grid */}
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
      </div>
    </AdminLayout>
  )
}
