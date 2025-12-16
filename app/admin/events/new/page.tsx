'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CalendarDays, Save, Image, MapPin,
  DollarSign, Users, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

export default function NewEventPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [temples, setTemples] = useState<any[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    templeId: '',
    date: '',
    time: '09:00',
    description: '',
    price: 2000,
    originalPrice: 0,
    maxParticipants: 100,
    imageUrl: '',
    isActive: true,
  })

  useEffect(() => {
    setMounted(true)
    fetchTemples()
  }, [])

  const fetchTemples = async () => {
    try {
      const res = await fetch('/api/temples')
      if (res.ok) {
        const data = await res.json()
        setTemples(data)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
    }
  }

  // 自動產生 slug
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          temple_id: formData.templeId,
          start_date: `${formData.date}T${formData.time}:00`,
          end_date: `${formData.date}T${formData.time}:00`,
          price: formData.price,
          max_participants: formData.maxParticipants,
          image_url: formData.imageUrl,
          is_active: formData.isActive,
        }),
      })

      if (res.ok) {
        alert('活動已建立成功！')
        router.push('/admin/events')
      } else {
        const error = await res.json()
        alert(`建立失敗：${error.error}`)
      }
    } catch (error) {
      console.error('Failed to create event:', error)
      alert('建立失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-4xl animate-bounce">🏮</div>
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
                新增法會活動
              </h1>
              <p className="text-gray-500 text-sm">建立新的法會或活動</p>
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
                    placeholder="如：2025新春祈福法會"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>網址代稱（Slug）</Label>
                  <Input
                    placeholder="自動產生"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="mt-1 font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    活動頁面網址將會是：/events/{formData.slug || 'xxx'}
                  </p>
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
                    rows={5}
                    placeholder="請輸入活動詳細說明..."
                    className="w-full mt-1 p-3 border border-gray-200 rounded-lg resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 時間地點 */}
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
                    <Label>原價（選填，顯示優惠）</Label>
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
                      min={1}
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                      className="mt-1"
                    />
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

                {/* 預覽 */}
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
                    <h3 className="font-medium text-gray-900">立即發布</h3>
                    <p className="text-sm text-gray-500">開啟後活動將顯示在前台</p>
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
          <div className="flex justify-end gap-4">
            <Link href="/admin/events">
              <Button variant="outline" type="button">
                取消
              </Button>
            </Link>
            <Button variant="temple" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  建立中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  建立活動
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}





