'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Image, Plus, Edit, Trash2, Eye, EyeOff,
  Calendar, Link as LinkIcon, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// 模擬廣告資料
const mockBanners = [
  {
    id: 1,
    title: '2025新春祈福特惠',
    subtitle: '光明燈、平安燈全面8折',
    link: '/events/new-year-blessing-2025',
    templeName: '艋舺龍山寺',
    bgColor: 'from-red-600 to-red-800',
    active: true,
    startDate: '2024-12-01',
    endDate: '2025-02-15',
    order: 1,
  },
  {
    id: 2,
    title: '元宵節點燈活動',
    subtitle: '報名即送精美福袋',
    link: '/events/yuanxiao-lantern-2025',
    templeName: '臺北行天宮',
    bgColor: 'from-orange-500 to-red-600',
    active: true,
    startDate: '2024-12-01',
    endDate: '2025-02-12',
    order: 2,
  },
  {
    id: 3,
    title: '月老燈特別企劃',
    subtitle: '祈求良緣，姻緣燈85折',
    link: '/temples/xiahai-temple',
    templeName: '臺北霞海城隍廟',
    bgColor: 'from-pink-500 to-rose-600',
    active: false,
    startDate: '2024-12-01',
    endDate: '2025-03-14',
    order: 3,
  },
]

const bgColorOptions = [
  { value: 'from-red-600 to-red-800', label: '紅色', preview: 'bg-gradient-to-r from-red-600 to-red-800' },
  { value: 'from-orange-500 to-red-600', label: '橘紅色', preview: 'bg-gradient-to-r from-orange-500 to-red-600' },
  { value: 'from-pink-500 to-rose-600', label: '粉紅色', preview: 'bg-gradient-to-r from-pink-500 to-rose-600' },
  { value: 'from-purple-500 to-indigo-600', label: '紫色', preview: 'bg-gradient-to-r from-purple-500 to-indigo-600' },
  { value: 'from-blue-500 to-indigo-600', label: '藍色', preview: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
  { value: 'from-green-500 to-teal-600', label: '綠色', preview: 'bg-gradient-to-r from-green-500 to-teal-600' },
  { value: 'from-yellow-500 to-orange-600', label: '金黃色', preview: 'bg-gradient-to-r from-yellow-500 to-orange-600' },
]

export default function AdminBannersPage() {
  const [mounted, setMounted] = useState(false)
  const [banners, setBanners] = useState(mockBanners)
  const [showForm, setShowForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    templeName: '',
    bgColor: 'from-red-600 to-red-800',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggleActive = (id: number) => {
    setBanners(banners.map(b => 
      b.id === id ? { ...b, active: !b.active } : b
    ))
  }

  const handleDelete = (id: number) => {
    if (confirm('確定要刪除這個廣告嗎？')) {
      setBanners(banners.filter(b => b.id !== id))
    }
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link,
      templeName: banner.templeName,
      bgColor: banner.bgColor,
      startDate: banner.startDate,
      endDate: banner.endDate,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBanner) {
      setBanners(banners.map(b => 
        b.id === editingBanner.id ? { ...b, ...formData } : b
      ))
    } else {
      setBanners([...banners, {
        id: Date.now(),
        ...formData,
        active: true,
        order: banners.length + 1,
      }])
    }
    
    setShowForm(false)
    setEditingBanner(null)
    setFormData({
      title: '',
      subtitle: '',
      link: '',
      templeName: '',
      bgColor: 'from-red-600 to-red-800',
      startDate: '',
      endDate: '',
    })
  }

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
                <Image className="w-6 h-6 text-temple-gold-400" />
                廣告 Banner 管理
              </h1>
              <p className="text-gray-400 text-sm mt-1">管理首頁輪播廣告</p>
            </div>
            <Button 
              className="bg-temple-gold-600 hover:bg-temple-gold-700 text-white"
              onClick={() => {
                setEditingBanner(null)
                setFormData({
                  title: '',
                  subtitle: '',
                  link: '',
                  templeName: '',
                  bgColor: 'from-red-600 to-red-800',
                  startDate: '',
                  endDate: '',
                })
                setShowForm(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              新增廣告
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Banners List */}
        <div className="space-y-4">
          {banners.map((banner, index) => {
            const isActive = banner.active && new Date() >= new Date(banner.startDate) && new Date() <= new Date(banner.endDate)
            
            return (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gray-800 border-gray-700 ${!banner.active ? 'opacity-50' : ''}`}>
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Preview */}
                      <div className={`w-64 h-40 bg-gradient-to-r ${banner.bgColor} flex items-center justify-center p-4`}>
                        <div className="text-white text-center">
                          <div className="font-bold">{banner.title}</div>
                          <div className="text-sm opacity-80">{banner.subtitle}</div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-white">{banner.title}</h3>
                              {isActive ? (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                                  顯示中
                                </span>
                              ) : banner.active ? (
                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                                  排程中
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
                                  已停用
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{banner.subtitle}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {banner.templeName}
                              </span>
                              <span className="flex items-center gap-1">
                                <LinkIcon className="w-4 h-4" />
                                {banner.link}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {banner.startDate} ~ {banner.endDate}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                              onClick={() => handleToggleActive(banner.id)}
                            >
                              {banner.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                              onClick={() => handleEdit(banner)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-500/20"
                              onClick={() => handleDelete(banner.id)}
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
            )
          })}
        </div>

        {banners.length === 0 && (
          <Card className="bg-gray-800 border-gray-700 text-center py-16">
            <CardContent>
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">尚無廣告</h3>
              <p className="text-gray-500 mb-6">新增第一個首頁廣告</p>
              <Button 
                className="bg-temple-gold-600 hover:bg-temple-gold-700 text-white"
                onClick={() => setShowForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                新增廣告
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingBanner ? '編輯廣告' : '新增廣告'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label className="text-gray-300">標題 *</Label>
                <Input
                  required
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-gray-300">副標題</Label>
                <Input
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-gray-300">連結網址 *</Label>
                <Input
                  required
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  placeholder="/events/xxx 或 /temples/xxx"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-gray-300">廟宇名稱 *</Label>
                <Input
                  required
                  className="mt-1 bg-gray-700 border-gray-600 text-white"
                  value={formData.templeName}
                  onChange={(e) => setFormData({ ...formData, templeName: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-gray-300">背景顏色</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {bgColorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, bgColor: color.value })}
                      className={`h-12 rounded-lg ${color.preview} ${
                        formData.bgColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">上架日期 *</Label>
                  <Input
                    type="date"
                    required
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">下架日期 *</Label>
                  <Input
                    type="date"
                    required
                    className="mt-1 bg-gray-700 border-gray-600 text-white"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Preview */}
              <div>
                <Label className="text-gray-300">預覽</Label>
                <div className={`mt-2 h-32 bg-gradient-to-r ${formData.bgColor} rounded-lg flex items-center justify-center p-4`}>
                  <div className="text-white text-center">
                    <div className="font-bold text-lg">{formData.title || '標題'}</div>
                    <div className="text-sm opacity-80">{formData.subtitle || '副標題'}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBanner(null)
                  }}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="bg-temple-gold-600 hover:bg-temple-gold-700 text-white"
                >
                  {editingBanner ? '儲存變更' : '新增廣告'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}


