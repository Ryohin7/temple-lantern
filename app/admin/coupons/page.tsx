'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, Search, 
  Plus, Edit, Trash2, LogOut, Tag, Percent, Clock, CheckCircle, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'
import { mockCoupons, type Coupon } from '@/lib/coupon'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: Tag, label: '折扣碼管理', href: '/admin/coupons', active: true },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

export default function AdminCouponsPage() {
  const [mounted, setMounted] = useState(false)
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 100,
    perUserLimit: 1,
    startDate: '',
    endDate: '',
    isActive: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    setEditingCoupon(null)
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      usageLimit: 100,
      perUserLimit: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description,
      type: coupon.type as 'percentage' | 'fixed',
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit,
      perUserLimit: coupon.perUserLimit,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      isActive: coupon.isActive,
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此折扣碼嗎？')) {
      setCoupons(coupons.filter(c => c.id !== id))
      alert('折扣碼已刪除')
    }
  }

  const handleToggleActive = (id: string) => {
    setCoupons(coupons.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ))
  }

  const handleSave = () => {
    if (!formData.code || !formData.name) {
      alert('請填寫必要欄位')
      return
    }

    if (editingCoupon) {
      setCoupons(coupons.map(c => 
        c.id === editingCoupon.id 
          ? { ...c, ...formData, maxDiscount: formData.maxDiscount || undefined }
          : c
      ))
      alert('折扣碼已更新')
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        ...formData,
        maxDiscount: formData.maxDiscount || undefined,
        usedCount: 0,
        createdAt: new Date().toISOString(),
      }
      setCoupons([newCoupon, ...coupons])
      alert('折扣碼已建立')
    }
    setShowModal(false)
  }

  const getCouponStatus = (coupon: Coupon) => {
    const now = new Date()
    const start = new Date(coupon.startDate)
    const end = new Date(coupon.endDate)

    if (!coupon.isActive) return { status: 'inactive', label: '已停用', color: 'gray' }
    if (now < start) return { status: 'upcoming', label: '未開始', color: 'blue' }
    if (now > end) return { status: 'expired', label: '已過期', color: 'red' }
    if (coupon.usedCount >= coupon.usageLimit) return { status: 'exhausted', label: '已用完', color: 'orange' }
    return { status: 'active', label: '使用中', color: 'green' }
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
                  <Tag className="w-6 h-6 text-temple-red-600" />
                  折扣碼管理
                </h1>
                <p className="text-gray-500 text-sm">建立與管理優惠折扣碼</p>
              </div>
              <Button onClick={handleCreate} variant="temple">
                <Plus className="w-4 h-4 mr-2" />
                新增折扣碼
              </Button>
            </div>
          </header>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900">{coupons.length}</div>
                  <div className="text-gray-500">全部折扣碼</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {coupons.filter(c => getCouponStatus(c).status === 'active').length}
                  </div>
                  <div className="text-gray-500">使用中</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {coupons.reduce((sum, c) => sum + c.usedCount, 0)}
                  </div>
                  <div className="text-gray-500">總使用次數</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-temple-gold-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-temple-gold-600">
                    {coupons.filter(c => getCouponStatus(c).status === 'upcoming').length}
                  </div>
                  <div className="text-gray-500">即將開始</div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="搜尋折扣碼..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Coupons List */}
            <div className="space-y-4">
              {filteredCoupons.map((coupon, index) => {
                const statusInfo = getCouponStatus(coupon)
                
                return (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                              coupon.type === 'percentage' 
                                ? 'bg-purple-100' 
                                : 'bg-green-100'
                            }`}>
                              {coupon.type === 'percentage' ? (
                                <Percent className="w-8 h-8 text-purple-600" />
                              ) : (
                                <DollarSign className="w-8 h-8 text-green-600" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">
                                  {coupon.code}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  statusInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                                  statusInfo.color === 'red' ? 'bg-red-100 text-red-700' :
                                  statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                  statusInfo.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <div className="text-gray-700 font-medium mt-1">{coupon.name}</div>
                              <div className="text-gray-500 text-sm mt-1">{coupon.description}</div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {coupon.startDate} ~ {coupon.endDate}
                                </span>
                                <span>
                                  已使用 {coupon.usedCount} / {coupon.usageLimit} 次
                                </span>
                                <span>
                                  最低消費 ${coupon.minOrderAmount}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-temple-red-600">
                                {coupon.type === 'percentage' ? (
                                  <>{coupon.value}% OFF</>
                                ) : (
                                  <>-${coupon.value}</>
                                )}
                              </div>
                              {coupon.maxDiscount && (
                                <div className="text-xs text-gray-500">
                                  最高折 ${coupon.maxDiscount}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(coupon.id)}
                              >
                                {coupon.isActive ? (
                                  <XCircle className="w-4 h-4 mr-1 text-red-500" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                )}
                                {coupon.isActive ? '停用' : '啟用'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(coupon)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(coupon.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {filteredCoupons.length === 0 && (
              <Card className="p-12 text-center">
                <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">找不到折扣碼</h3>
                <p className="text-gray-500 mt-1">請嘗試其他搜尋條件或建立新的折扣碼</p>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCoupon ? '編輯折扣碼' : '新增折扣碼'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    折扣碼 *
                  </label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="如：NEWYEAR2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    名稱 *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="新春優惠"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  描述
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="全站點燈服務 85 折"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    折扣類型
                  </label>
                  <select
                    className="w-full p-2 border border-gray-200 rounded-lg"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                  >
                    <option value="percentage">百分比折扣</option>
                    <option value="fixed">固定金額折抵</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'percentage' ? '折扣 (%)' : '折抵金額'}
                  </label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最低消費金額
                  </label>
                  <Input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  />
                </div>
                {formData.type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      最高折抵金額
                    </label>
                    <Input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    總使用次數
                  </label>
                  <Input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    每人限用次數
                  </label>
                  <Input
                    type="number"
                    value={formData.perUserLimit}
                    onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    開始日期
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    結束日期
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  立即啟用
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                取消
              </Button>
              <Button variant="temple" onClick={handleSave}>
                {editingCoupon ? '更新' : '建立'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}




