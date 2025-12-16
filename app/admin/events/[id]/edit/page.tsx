'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CalendarDays, Save, Image,
  DollarSign, FileText, Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

// Removed mock temples


export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [currentParticipants, setCurrentParticipants] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    templeId: '',
    date: '',
    time: '',
    description: '',
    price: 0,
    originalPrice: 0,
    maxParticipants: 0,
    imageUrl: '',
    isActive: true,
  })

  const [temples, setTemples] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchTemples()
    fetchEvent()
  }, [])

  const fetchTemples = async () => {
    try {
      const res = await fetch('/api/admin/temples')
      if (res.ok) {
        const data = await res.json()
        setTemples(data)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    }
  }

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          title: data.title,
          slug: data.slug,
          templeId: data.temple_id,
          date: data.event_date.split('T')[0],
          time: data.event_time,
          description: data.description || '',
          price: data.price,
          originalPrice: data.original_price || 0,
          maxParticipants: data.max_participants,
          imageUrl: data.image_url || '',
          isActive: data.is_active,
        })
        setCurrentParticipants(data.current_participants || 0)
      } else {
        console.error('Failed to fetch event')
        alert('找不到活動')
        router.push('/admin/events')
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
      alert('載入失敗')
    } finally {
      setFetching(false)
    }
  }

  if (params.id) {
    fetchEvent()
  }
}, [params.id, router])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    // 轉換數據格式以符合 API 預期
    const apiData = {
      title: formData.title,
      slug: formData.slug,
      temple_id: formData.templeId,
      event_date: formData.date,
      event_time: formData.time,
      description: formData.description,
      price: formData.price,
      original_price: formData.originalPrice,
      max_participants: formData.maxParticipants,
      image_url: formData.imageUrl,
      is_active: formData.isActive,
    }

    const response = await fetch(`/api/admin/events/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })

    if (response.ok) {
      alert('活動已更新成功！')
      router.push('/admin/events')
    } else {
      const error = await response.json()
      alert(error.error || '更新失敗')
    }
  } catch (error) {
    console.error('Failed to update event:', error)
    alert('更新時發生錯誤')
  } finally {
    setLoading(false)
  }
}

const handleDelete = async () => {
  if (confirm('確定要刪除這個活動嗎？此操作無法復原！')) {
    try {
      const response = await fetch(`/api/admin/events/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('活動已刪除')
        router.push('/admin/events')
      } else {
        alert('刪除失敗')
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('刪除時發生錯誤')
    }
  }
}

if (!mounted || fetching) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl animate-bounce mb-2">🏮</div>
        <p className="text-gray-500">載入中...</p>
      </div>
    </div>
  )
}

return (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl">
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-temple-red-600 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          返回活動列表
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-temple-red-600" />
              編輯活動
            </h1>
            <p className="text-gray-500 text-sm">{formData.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              目前報名：{currentParticipants} / {formData.maxParticipants} 人
            </span>
          </div>
        </div>
      </div>
    </header>

    <div className="container mx-auto max-w-4xl px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本資訊 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-temple-red-600" />
                基本資訊
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>活動名稱 *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>網址代稱（Slug）</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label>主辦廟宇 *</Label>
                <select
                  required
                  className="w-full mt-1 p-2 border border-gray-200 rounded-lg"
                  value={formData.templeId}
                  onChange={(e) => setFormData({ ...formData, templeId: e.target.value })}
                >
                  <option value="">請選擇廟宇</option>
                  {temples.map((temple) => (
                    <option key={temple.id} value={temple.id}>
                      {temple.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>活動說明</Label>
                <textarea
                  rows={6}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-lg resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 時間設定 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-temple-red-600" />
                時間設定
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>活動日期 *</Label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>開始時間 *</Label>
                  <Input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 價格與名額 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-temple-red-600" />
                價格與名額
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>報名費用 *</Label>
                  <Input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>原價（選填）</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>名額上限 *</Label>
                  <Input
                    type="number"
                    required
                    min={currentParticipants}
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    不可低於目前報名人數 ({currentParticipants})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 圖片設定 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-temple-red-600" />
                活動圖片
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>圖片網址</Label>
                <Input
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="h-48 bg-temple-gradient rounded-lg flex items-center justify-center">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="預覽"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-white">
                    <Lantern size="lg" color="gold" animate={false} />
                    <p className="mt-2 opacity-70">活動圖片預覽</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 發布設定 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">活動狀態</h3>
                  <p className="text-sm text-gray-500">關閉後活動將從前台隱藏</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 提交按鈕 */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            刪除活動
          </Button>

          <div className="flex gap-4">
            <Link href="/admin/events">
              <Button variant="outline" type="button">
                取消
              </Button>
            </Link>
            <Button variant="temple" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  儲存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  儲存變更
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  </div>
)
}





