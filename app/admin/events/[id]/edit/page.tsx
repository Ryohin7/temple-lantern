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

// 模擬廟宇列表
const temples = [
  { id: 1, name: '艋舺龍山寺', slug: 'longshan-temple' },
  { id: 2, name: '臺北行天宮', slug: 'xingtian-temple' },
  { id: 3, name: '臺北霞海城隍廟', slug: 'xiahai-temple' },
  { id: 4, name: '大甲鎮瀾宮', slug: 'dajia-mazu' },
  { id: 5, name: '南鯤鯓代天府', slug: 'nankunshen' },
]

// 模擬活動資料
const mockEvent = {
  id: 1,
  title: '2025新春祈福法會',
  slug: 'new-year-blessing-2025',
  templeId: '1',
  date: '2025-01-25',
  time: '09:00',
  description: '迎接新年，龍山寺特別舉辦新春祈福法會，由住持法師帶領誦經祈福，為信眾祈求新年平安、事業順利、闔家安康。\n\n活動內容包含：\n- 法師誦經祈福\n- 點燈祈願\n- 精美福袋贈送\n- 平安素齋',
  price: 2000,
  originalPrice: 2500,
  maxParticipants: 300,
  participants: 156,
  imageUrl: '',
  isActive: true,
}

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    setMounted(true)
    // 模擬載入活動資料
    setFormData({
      title: mockEvent.title,
      slug: mockEvent.slug,
      templeId: mockEvent.templeId,
      date: mockEvent.date,
      time: mockEvent.time,
      description: mockEvent.description,
      price: mockEvent.price,
      originalPrice: mockEvent.originalPrice,
      maxParticipants: mockEvent.maxParticipants,
      imageUrl: mockEvent.imageUrl,
      isActive: mockEvent.isActive,
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 模擬 API 請求
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('活動已更新成功！')
    router.push('/admin/events')
  }

  const handleDelete = async () => {
    if (confirm('確定要刪除這個活動嗎？此操作無法復原！')) {
      await new Promise(resolve => setTimeout(resolve, 500))
      alert('活動已刪除')
      router.push('/admin/events')
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
                編輯活動
              </h1>
              <p className="text-gray-500 text-sm">{formData.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                目前報名：{mockEvent.participants} / {mockEvent.maxParticipants} 人
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
                      min={mockEvent.participants}
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      不可低於目前報名人數 ({mockEvent.participants})
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



