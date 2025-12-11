'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Flame, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 模擬燈種資料
const mockLanterns = [
  {
    id: 1,
    name: '光明燈',
    description: '照亮前程，事業順利，學業進步',
    price: 1200,
    duration: '一年',
    stock: 100,
    sold: 45,
    active: true,
    image: null,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: '財神燈',
    description: '招財進寶，財源廣進，生意興隆',
    price: 1800,
    duration: '一年',
    stock: 80,
    sold: 32,
    active: true,
    image: null,
    createdAt: '2024-01-01',
  },
  {
    id: 3,
    name: '平安燈',
    description: '闔家平安，出入平安，身體健康',
    price: 1000,
    duration: '一年',
    stock: 120,
    sold: 58,
    active: true,
    image: null,
    createdAt: '2024-01-01',
  },
  {
    id: 4,
    name: '月老燈',
    description: '姻緣美滿，桃花朵朵，良緣早結',
    price: 1500,
    duration: '一年',
    stock: 60,
    sold: 21,
    active: true,
    image: null,
    createdAt: '2024-01-01',
  },
  {
    id: 5,
    name: '文昌燈',
    description: '金榜題名，考試順利，學業有成',
    price: 1500,
    duration: '一年',
    stock: 50,
    sold: 15,
    active: false,
    image: null,
    createdAt: '2024-02-01',
  },
]

export default function TempleLanternsPage() {
  const [mounted, setMounted] = useState(false)
  const [lanterns, setLanterns] = useState(mockLanterns)
  const [searchQuery, setSearchQuery] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredLanterns = lanterns.filter(lantern =>
    lantern.name.includes(searchQuery) || lantern.description.includes(searchQuery)
  )

  const toggleActive = (id: number) => {
    setLanterns(lanterns.map(l =>
      l.id === id ? { ...l, active: !l.active } : l
    ))
  }

  const handleDelete = (id: number) => {
    setLanterns(lanterns.filter(l => l.id !== id))
    setShowDeleteModal(null)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

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
                <Flame className="w-6 h-6" />
                燈種管理
              </h1>
              <p className="text-white/80 text-sm mt-1">管理廟宇的點燈商品</p>
            </div>
            <Link href="/temple-admin/lanterns/new">
              <Button variant="gold">
                <Plus className="w-4 h-4 mr-2" />
                新增燈種
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="搜尋燈種名稱..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select className="px-3 py-2 border rounded-lg text-sm">
                  <option>全部狀態</option>
                  <option>上架中</option>
                  <option>已下架</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-temple-red-700">{lanterns.length}</div>
              <div className="text-gray-600 text-sm">總燈種數</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {lanterns.filter(l => l.active).length}
              </div>
              <div className="text-gray-600 text-sm">上架中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {lanterns.reduce((sum, l) => sum + l.sold, 0)}
              </div>
              <div className="text-gray-600 text-sm">總銷售數</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">
                {lanterns.reduce((sum, l) => sum + l.stock, 0)}
              </div>
              <div className="text-gray-600 text-sm">總庫存</div>
            </CardContent>
          </Card>
        </div>

        {/* Lanterns List */}
        <div className="space-y-4">
          {filteredLanterns.map((lantern, index) => (
            <motion.div
              key={lantern.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`overflow-hidden ${!lantern.active ? 'opacity-60' : ''}`}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-40 h-40 bg-temple-gradient flex items-center justify-center">
                      <Lantern size="md" color={lantern.active ? 'red' : 'gold'} animate={false} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-temple-red-800">
                              {lantern.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              lantern.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {lantern.active ? '上架中' : '已下架'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">{lantern.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-temple-red-700">
                            NT$ {lantern.price.toLocaleString()}
                          </div>
                          <div className="text-gray-500 text-sm">/ {lantern.duration}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-blue-600">{lantern.sold}</div>
                          <div className="text-xs text-gray-500">已售出</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-600">{lantern.stock}</div>
                          <div className="text-xs text-gray-500">庫存</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-purple-600">
                            ${(lantern.price * lantern.sold).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">總營收</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          建立於 {lantern.createdAt}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(lantern.id)}
                          >
                            {lantern.active ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                下架
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                上架
                              </>
                            )}
                          </Button>
                          <Link href={`/temple-admin/lanterns/${lantern.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              編輯
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => setShowDeleteModal(lantern.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredLanterns.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <div className="text-6xl mb-4">🏮</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">尚無燈種</h3>
              <p className="text-gray-500 mb-6">
                開始新增您的第一個燈種吧！
              </p>
              <Link href="/temple-admin/lanterns/new">
                <Button variant="temple">
                  <Plus className="w-4 h-4 mr-2" />
                  新增燈種
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-xl font-bold mb-2">確認刪除</h3>
            <p className="text-gray-600 mb-6">
              確定要刪除這個燈種嗎？此操作無法復原。
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(null)}>
                取消
              </Button>
              <Button
                variant="temple"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleDelete(showDeleteModal)}
              >
                確認刪除
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}


