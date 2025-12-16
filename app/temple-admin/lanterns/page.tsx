'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

export default function TempleAdminLanternsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lanterns, setLanterns] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchLanterns()
  }, [])

  const fetchLanterns = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/temple-admin/lanterns')
      if (res.ok) {
        const data = await res.json()
        setLanterns(data)
      }
    } catch (error) {
      console.error('Failed to fetch lanterns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個燈種嗎？')) return

    try {
      const res = await fetch(`/api/temple-admin/lanterns/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchLanterns()
      }
    } catch (error) {
      console.error('Failed to delete lantern:', error)
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-temple font-bold text-temple-red-800">燈種管理</h1>
            <p className="text-gray-600 mt-2">管理廟宇提供的點燈服務</p>
          </div>
          <Link href="/temple-admin/lanterns/new">
            <Button variant="temple">
              <Plus className="w-4 h-4 mr-2" />
              新增燈種
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lanterns.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500 mb-4">目前沒有燈種</p>
                  <Link href="/temple-admin/lanterns/new">
                    <Button variant="temple">新增第一個燈種</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            lanterns.map((lantern) => (
              <Card key={lantern.id} className="border-2 border-temple-gold-200">
                <CardHeader className="bg-temple-gold-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{lantern.name}</CardTitle>
                    <Lantern size="sm" color="red" animate={false} />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">價格：</span>
                      <span className="font-bold text-temple-red-700">
                        NT$ {lantern.price?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">期限：</span>
                      <span>{lantern.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">狀態：</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${lantern.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {lantern.status === 'active' ? '啟用' : '停用'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {lantern.description}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/temple-admin/lanterns/${lantern.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        編輯
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(lantern.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
