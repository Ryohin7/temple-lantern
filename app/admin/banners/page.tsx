'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, Tag,
  Plus, Edit, Trash2, Eye, EyeOff, Calendar, Link as LinkIcon, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: Tag, label: '折扣碼管理', href: '/admin/coupons' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners', active: true },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
          <div className="p-6 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <Lantern size="sm" color="red" animate />
              <div>
                <h1 className="font-temple font-bold text-temple-red-700">台灣點燈網</h1>
                <p className="text-xs text-gray-500">管理後台</p>
              </div>
            </Link>
          </div>

          <nav className="p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-temple-red-50 text-temple-red-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-temple-red-600">
                <LogOut className="w-5 h-5 mr-3" />
                登出系統
              </Button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
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
            <div className="space-y-4">
              {banners.map((banner, index) => {
                const now = new Date()
                const isInDateRange = new Date(banner.startDate) <= now && now <= new Date(banner.endDate)
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
                          <div className={`w-64 h-40 bg-gradient-to-r ${banner.bgColor} flex items-center justify-center p-4 rounded-l-lg`}>
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

            {banners.length === 0 && (
              <Card className="p-12 text-center">
                <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">尚無廣告</h3>
                <p className="text-gray-500 mt-1 mb-4">新增第一個首頁廣告</p>
                <Button variant="temple" onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增廣告
                </Button>
              </Card>
            )}
          </div>
        </main>
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
                <Label>廟宇名稱 *</Label>
                <Input
                  required
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
                      className={`h-12 rounded-lg ${color.preview} ${
                        formData.bgColor === color.value ? 'ring-2 ring-temple-red-600 ring-offset-2' : ''
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
    </div>
  )
}
