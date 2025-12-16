'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plus, Edit, Trash2, Eye, EyeOff, Calendar, Link as LinkIcon, Image, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AdminLayout from '@/components/admin/AdminLayout'

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
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState<any[]>([])
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
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/banners')
      if (res.ok) {
        const data = await res.json()
        setBanners(data)
      }
    } catch (error) {
      console.error('Failed to fetch banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    // TODO: Implement API call to toggle banner status
    setBanners(banners.map(b =>
      b.id === id ? { ...b, active: !b.active } : b
    ))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個廣告嗎？')) return

    // TODO: Implement API call to delete banner
    setBanners(banners.filter(b => b.id !== id))
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link,
      templeName: banner.temple_name || '',
      bgColor: banner.bg_color || 'from-red-600 to-red-800',
      startDate: banner.start_date?.split('T')[0] || '',
      endDate: banner.end_date?.split('T')[0] || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // TODO: Implement API call to create/update banner
    if (editingBanner) {
      setBanners(banners.map(b =>
        b.id === editingBanner.id ? { ...b, ...formData } : b
      ))
    } else {
      setBanners([...banners, {
        id: Date.now().toString(),
        ...formData,
        active: true,
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

  if (!mounted) return null

  return (
    <AdminLayout>
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Image className="w-6 h-6 text-temple-red-600" />
              廣告 Banner 管理
            </h1>
            <p className="text-gray-500 text-sm">管理首頁輪播廣告</p>
          </div>
          <Button
            variant="temple"
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
      </header>

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{banners.length}</div>
              <div className="text-gray-500">總廣告數</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {banners.filter(b => b.active).length}
              </div>
              <div className="text-gray-500">已啟用</div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-gray-400">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-500">
                {banners.filter(b => !b.active).length}
              </div>
              <div className="text-gray-500">已停用</div>
            </CardContent>
          </Card>
        </div>

        {/* Banners List */}
        {loading ? (
          <p className="text-center py-8 text-gray-500">載入中...</p>
        ) : banners.length === 0 ? (
          <Card className="p-12 text-center">
            <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700">尚無廣告</h3>
            <p className="text-gray-500 mt-1 mb-4">新增第一個首頁廣告</p>
            <Button variant="temple" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新增廣告
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => {
              const now = new Date()
              const isInDateRange = banner.start_date && banner.end_date &&
                new Date(banner.start_date) <= now && now <= new Date(banner.end_date)
              const isActive = banner.active && isInDateRange

              return (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`hover:shadow-md transition-shadow ${!banner.active ? 'opacity-60' : ''}`}>
                    <CardContent className="p-0">
                      <div className="flex">
                        {/* Preview */}
                        <div className={`w-64 h-40 bg-gradient-to-r ${banner.bg_color || 'from-red-600 to-red-800'} flex items-center justify-center p-4 rounded-l-lg`}>
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
                                <h3 className="text-lg font-bold text-gray-900">{banner.title}</h3>
                                {isActive ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    顯示中
                                  </span>
                                ) : banner.active ? (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                    排程中
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                    已停用
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-3">{banner.subtitle}</p>

                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                {banner.temple_name && (
                                  <span className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4" />
                                    {banner.temple_name}
                                  </span>
                                )}
                                {banner.link && (
                                  <span className="flex items-center gap-1">
                                    <LinkIcon className="w-4 h-4" />
                                    {banner.link}
                                  </span>
                                )}
                                {banner.start_date && banner.end_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {banner.start_date.split('T')[0]} ~ {banner.end_date.split('T')[0]}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(banner.id)}
                              >
                                {banner.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(banner)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
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
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBanner ? '編輯廣告' : '新增廣告'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label>標題 *</Label>
                <Input
                  required
                  className="mt-1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>副標題</Label>
                <Input
                  className="mt-1"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div>
                <Label>連結網址 *</Label>
                <Input
                  required
                  className="mt-1"
                  placeholder="/events/xxx 或 /temples/xxx"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
              <div>
                <Label>廟宇名稱</Label>
                <Input
                  className="mt-1"
                  value={formData.templeName}
                  onChange={(e) => setFormData({ ...formData, templeName: e.target.value })}
                />
              </div>
              <div>
                <Label>背景顏色</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {bgColorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, bgColor: color.value })}
                      className={`h-12 rounded-lg ${color.preview} ${formData.bgColor === color.value ? 'ring-2 ring-temple-red-600 ring-offset-2' : ''
                        }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>上架日期 *</Label>
                  <Input
                    type="date"
                    required
                    className="mt-1"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>下架日期 *</Label>
                  <Input
                    type="date"
                    required
                    className="mt-1"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Preview */}
              <div>
                <Label>預覽</Label>
                <div className={`mt-2 h-32 bg-gradient-to-r ${formData.bgColor} rounded-lg flex items-center justify-center p-4`}>
                  <div className="text-white text-center">
                    <div className="font-bold text-lg">{formData.title || '標題'}</div>
                    <div className="text-sm opacity-80">{formData.subtitle || '副標題'}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingBanner(null)
                  }}
                >
                  取消
                </Button>
                <Button type="submit" variant="temple">
                  {editingBanner ? '儲存變更' : '新增廣告'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  )
}
