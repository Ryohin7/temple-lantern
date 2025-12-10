'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Building2, Search, CheckCircle, XCircle, 
  Eye, Edit, MoreHorizontal, MapPin, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 模擬廟宇資料
const mockTemples = [
  {
    id: 1,
    name: '艋舺龍山寺',
    city: '台北市',
    mainGod: '觀世音菩薩',
    status: 'active',
    joinDate: '2024-01-15',
    totalOrders: 456,
    totalRevenue: 547200,
    rating: 4.8,
  },
  {
    id: 2,
    name: '臺北行天宮',
    city: '台北市',
    mainGod: '關聖帝君',
    status: 'active',
    joinDate: '2024-02-01',
    totalOrders: 389,
    totalRevenue: 467000,
    rating: 4.9,
  },
  {
    id: 3,
    name: '大甲鎮瀾宮',
    city: '台中市',
    mainGod: '天上聖母',
    status: 'active',
    joinDate: '2024-03-10',
    totalOrders: 678,
    totalRevenue: 813600,
    rating: 4.9,
  },
  {
    id: 4,
    name: '新竹城隍廟',
    city: '新竹市',
    mainGod: '城隍爺',
    status: 'pending',
    joinDate: '2024-12-08',
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
  },
  {
    id: 5,
    name: '彰化南瑤宮',
    city: '彰化縣',
    mainGod: '天上聖母',
    status: 'pending',
    joinDate: '2024-12-09',
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
  },
]

export default function AdminTemplesPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTemples = mockTemples.filter(temple => {
    const matchSearch = temple.name.includes(searchQuery) || temple.city.includes(searchQuery)
    const matchStatus = statusFilter === 'all' || temple.status === statusFilter
    return matchSearch && matchStatus
  })

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-6 px-6">
        <div className="container mx-auto">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回後台
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-400" />
                廟宇管理
              </h1>
              <p className="text-gray-400 text-sm mt-1">管理平台上的合作廟宇</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white">{mockTemples.length}</div>
              <div className="text-gray-400">總廟宇數</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400">
                {mockTemples.filter(t => t.status === 'active').length}
              </div>
              <div className="text-gray-400">上線中</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {mockTemples.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-gray-400">待審核</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-temple-gold-400">
                ${mockTemples.reduce((sum, t) => sum + t.totalRevenue, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">總營收</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="搜尋廟宇名稱或地區..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">全部狀態</option>
                <option value="active">上線中</option>
                <option value="pending">待審核</option>
                <option value="suspended">已停權</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Temples List */}
        <div className="space-y-4">
          {filteredTemples.map((temple, index) => (
            <motion.div
              key={temple.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                        <Lantern size="md" color="gold" animate={false} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{temple.name}</h3>
                          {temple.status === 'pending' && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                              待審核
                            </span>
                          )}
                          {temple.status === 'active' && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                              上線中
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {temple.city}
                          </span>
                          <span>主祀：{temple.mainGod}</span>
                          {temple.rating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {temple.rating}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          加入日期：{temple.joinDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {temple.status === 'active' && (
                        <div className="text-right">
                          <div className="text-gray-400 text-sm">總訂單 / 營收</div>
                          <div className="text-white font-bold">
                            {temple.totalOrders} 筆 / ${temple.totalRevenue.toLocaleString()}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {temple.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              核准
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-500/20">
                              <XCircle className="w-4 h-4 mr-1" />
                              駁回
                            </Button>
                          </>
                        )}
                        {temple.status === 'active' && (
                          <>
                            <Link href={`/temples/${temple.id}`} target="_blank">
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

