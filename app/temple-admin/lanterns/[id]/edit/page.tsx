'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Flame, Save, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

// 模擬燈種資料
const mockLantern = {
  id: 1,
  name: '光明燈',
  description: '照亮前程，事業順利，學業進步',
  benefits: '光明燈是廟宇最常見的點燈服務，象徵著光明與希望。點光明燈可以為信眾帶來事業上的順利、學業的進步，以及生活中的各種順遂。',
  price: 1200,
  duration: '一年',
  stock: 100,
  active: true,
  image: null,
}

export default function EditLanternPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    benefits: '',
    price: '',
    duration: '一年',
    stock: '',
    active: true,
    image: null as File | null,
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    setMounted(true)
    // 模擬載入資料
    setFormData({
      name: mockLantern.name,
      description: mockLantern.description,
      benefits: mockLantern.benefits,
      price: String(mockLantern.price),
      duration: mockLantern.duration,
      stock: String(mockLantern.stock),
      active: mockLantern.active,
      image: null,
    })
  }, [])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.name) newErrors.name = '請輸入燈種名稱'
    if (!formData.description) newErrors.description = '請輸入燈種說明'
    if (!formData.price) newErrors.price = '請輸入價格'
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = '請輸入有效的價格'
    }
    if (!formData.stock) newErrors.stock = '請輸入庫存數量'
    else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = '請輸入有效的庫存數量'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setLoading(true)

    // 模擬 API 請求
    setTimeout(() => {
      setLoading(false)
      router.push('/temple-admin/lanterns')
    }, 1500)
  }

  const handleDelete = () => {
    // 模擬刪除
    router.push('/temple-admin/lanterns')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
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
            href="/temple-admin/lanterns"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回燈種列表
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-temple font-bold flex items-center gap-2">
              <Flame className="w-6 h-6" />
              編輯燈種
            </h1>
            <Button
              variant="outline"
              className="bg-transparent border-white/50 text-white hover:bg-white/10"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              刪除燈種
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {/* 上架狀態 */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">上架狀態</h3>
                      <p className="text-gray-500 text-sm">控制此燈種是否顯示在前台</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                      <span className="ml-3 text-sm font-medium">
                        {formData.active ? '上架中' : '已下架'}
                      </span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* 基本資訊 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">基本資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 燈種名稱 */}
                  <div>
                    <Label htmlFor="name">燈種名稱 *</Label>
                    <Input
                      id="name"
                      placeholder="例如：光明燈、財神燈"
                      className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* 燈種說明 */}
                  <div>
                    <Label htmlFor="description">燈種說明 *</Label>
                    <textarea
                      id="description"
                      placeholder="簡短描述這個燈種的用途"
                      className={`mt-1 w-full px-3 py-2 border rounded-lg min-h-[80px] ${errors.description ? 'border-red-500' : ''}`}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  {/* 功效說明 */}
                  <div>
                    <Label htmlFor="benefits">功效說明</Label>
                    <textarea
                      id="benefits"
                      placeholder="詳細說明點此燈的功效..."
                      className="mt-1 w-full px-3 py-2 border rounded-lg min-h-[100px]"
                      value={formData.benefits}
                      onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 價格與庫存 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">價格與庫存</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* 價格 */}
                    <div>
                      <Label htmlFor="price">價格 (NT$) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="1200"
                        className={`mt-1 ${errors.price ? 'border-red-500' : ''}`}
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                      {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>

                    {/* 點燈期間 */}
                    <div>
                      <Label htmlFor="duration">點燈期間</Label>
                      <select
                        id="duration"
                        className="mt-1 w-full px-3 py-2 border rounded-lg"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      >
                        <option value="一個月">一個月</option>
                        <option value="三個月">三個月</option>
                        <option value="半年">半年</option>
                        <option value="一年">一年</option>
                        <option value="永久">永久</option>
                      </select>
                    </div>
                  </div>

                  {/* 庫存 */}
                  <div>
                    <Label htmlFor="stock">庫存數量 *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="100"
                      className={`mt-1 ${errors.stock ? 'border-red-500' : ''}`}
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                    <p className="text-gray-500 text-sm mt-1">設定為 0 表示無限制</p>
                  </div>
                </CardContent>
              </Card>

              {/* 圖片上傳 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">燈種圖片</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-temple-gold-400 transition-colors">
                    {formData.image ? (
                      <div className="space-y-4">
                        <div className="w-32 h-32 mx-auto bg-temple-gradient rounded-lg flex items-center justify-center">
                          <Lantern size="lg" color="red" animate={false} />
                        </div>
                        <p className="text-gray-600">{formData.image.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({ ...formData, image: null })}
                        >
                          <X className="w-4 h-4 mr-2" />
                          移除圖片
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                        <div className="space-y-4">
                          <div className="w-32 h-32 mx-auto bg-temple-gradient rounded-lg flex items-center justify-center">
                            <Lantern size="lg" color="red" animate={false} />
                          </div>
                          <div>
                            <p className="text-gray-600">點擊更換圖片</p>
                            <p className="text-gray-400 text-sm">支援 JPG、PNG，建議尺寸 400x400</p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Link href="/temple-admin/lanterns">
                  <Button type="button" variant="outline">
                    取消
                  </Button>
                </Link>
                <Button type="submit" variant="temple" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      儲存中...
                    </span>
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
              確定要刪除「{formData.name}」嗎？此操作無法復原。
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                取消
              </Button>
              <Button
                variant="temple"
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
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


