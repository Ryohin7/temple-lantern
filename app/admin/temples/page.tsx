'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, Search, 
  CheckCircle, XCircle, Eye, Edit, MapPin, Star, LogOut,
  MoreHorizontal, Trash2, Ban, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples', active: true },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

// 模擬廟宇資料
const mockTemples = [
  {
    id: 1,
    name: '艋舺龍山寺',
    city: '台北市',
    mainGod: '觀世音菩薩',
    status: 'active',
    joinDate: '2024-01-15',
    totalOrders: 456,
    totalRevenue: 547200,
    rating: 4.8,
    contact: '02-2302-5162',
    email: 'info@lungshan.org.tw',
  },
  {
    id: 2,
    name: '臺北行天宮',
    city: '台北市',
    mainGod: '關聖帝君',
    status: 'active',
    joinDate: '2024-02-01',
    totalOrders: 389,
    totalRevenue: 467000,
    rating: 4.9,
    contact: '02-2502-7924',
    email: 'service@xingtian.org.tw',
  },
  {
    id: 3,
    name: '大甲鎮瀾宮',
    city: '台中市',
    mainGod: '天上聖母',
    status: 'active',
    joinDate: '2024-03-10',
    totalOrders: 678,
    totalRevenue: 813600,
    rating: 4.9,
    contact: '04-2676-3522',
    email: 'mazu@dajiamazu.org.tw',
  },
  {
    id: 4,
    name: '新竹城隍廟',
    city: '新竹市',
    mainGod: '城隍爺',
    status: 'pending',
    joinDate: '2024-12-08',
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
    contact: '03-522-3264',
    email: 'hsinchu.chenghuang@gmail.com',
  },
  {
    id: 5,
    name: '彰化南瑤宮',
    city: '彰化縣',
    mainGod: '天上聖母',
    status: 'pending',
    joinDate: '2024-12-09',
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
    contact: '04-722-2012',
    email: 'nanyao@example.com',
  },
  {
    id: 6,
    name: '測試廟宇',
    city: '高雄市',
    mainGod: '媽祖',
    status: 'suspended',
    joinDate: '2024-06-15',
    totalOrders: 23,
    totalRevenue: 28000,
    rating: 3.2,
    contact: '07-1234-5678',
    email: 'test@example.com',
  },
]

export default function AdminTemplesPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [temples, setTemples] = useState(mockTemples)
  const [showModal, setShowModal] = useState<string | null>(null)
  const [selectedTemple, setSelectedTemple] = useState<typeof mockTemples[0] | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTemples = temples.filter(temple => {
    const matchSearch = temple.name.includes(searchQuery) || temple.city.includes(searchQuery)
    const matchStatus = statusFilter === 'all' || temple.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleApprove = (templeId: number) => {
    setTemples(temples.map(t => 
      t.id === templeId ? { ...t, status: 'active' } : t
    ))
    alert('廟宇已核准上線！')
  }

  const handleReject = (templeId: number) => {
    if (confirm('確定要駁回此廟宇申請嗎？')) {
      setTemples(temples.filter(t => t.id !== templeId))
      alert('已駁回廟宇申請')
    }
  }

  const handleSuspend = (templeId: number) => {
    if (confirm('確定要停權此廟宇嗎？')) {
      setTemples(temples.map(t => 
        t.id === templeId ? { ...t, status: 'suspended' } : t
      ))
      alert('廟宇已停權')
    }
  }

  const handleReactivate = (templeId: number) => {
    setTemples(temples.map(t => 
      t.id === templeId ? { ...t, status: 'active' } : t
    ))
    alert('廟宇已重新上線')
  }

  const handleDelete = (templeId: number) => {
    if (confirm('確定要刪除此廟宇嗎？此操作無法復原！')) {
      setTemples(temples.filter(t => t.id !== templeId))
      alert('廟宇已刪除')
    }
  }

  const openDetailModal = (temple: typeof mockTemples[0]) => {
    setSelectedTemple(temple)
    setShowModal('detail')
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
                  <Building2 className="w-6 h-6 text-temple-red-600" />
                  廟宇管理
                </h1>
                <p className="text-gray-500 text-sm">管理平台上的合作廟宇</p>
              </div>
            </div>
          </header>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900">{temples.length}</div>
                  <div className="text-gray-500">總廟宇數</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {temples.filter(t => t.status === 'active').length}
                  </div>
                  <div className="text-gray-500">上線中</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {temples.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-gray-500">待審核</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {temples.filter(t => t.status === 'suspended').length}
                  </div>
                  <div className="text-gray-500">已停權</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="搜尋廟宇名稱或地區..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">全部狀態</option>
                    <option value="active">上線中</option>
                    <option value="pending">待審核</option>
                    <option value="suspended">已停權</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Temples List */}
            <div className="space-y-4">
              {filteredTemples.map((temple, index) => (
                <motion.div
                  key={temple.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                            <Lantern size="md" color="gold" animate={false} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900">{temple.name}</h3>
                              {temple.status === 'pending' && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                  待審核
                                </span>
                              )}
                              {temple.status === 'active' && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                  上線中
                                </span>
                              )}
                              {temple.status === 'suspended' && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                  已停權
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-sm flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {temple.city}
                              </span>
                              <span>主祀：{temple.mainGod}</span>
                              {temple.rating > 0 && (
                                <span className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                  {temple.rating}
                                </span>
                              )}
                            </div>
                            <div className="text-gray-400 text-xs mt-1">
                              加入日期：{temple.joinDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          {temple.status === 'active' && (
                            <div className="text-right">
                              <div className="text-gray-500 text-sm">總訂單 / 營收</div>
                              <div className="font-bold text-gray-900">
                                {temple.totalOrders} 筆 / ${temple.totalRevenue.toLocaleString()}
                              </div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            {temple.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleApprove(temple.id)}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  核准
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                  onClick={() => handleReject(temple.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  駁回
                                </Button>
                              </>
                            )}
                            {temple.status === 'active' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openDetailModal(temple)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  查看
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                  onClick={() => handleSuspend(temple.id)}
                                >
                                  <Ban className="w-4 h-4 mr-1" />
                                  停權
                                </Button>
                              </>
                            )}
                            {temple.status === 'suspended' && (
                              <>
                                <Button 
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleReactivate(temple.id)}
                                >
                                  <RefreshCw className="w-4 h-4 mr-1" />
                                  恢復
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                  onClick={() => handleDelete(temple.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  刪除
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTemples.length === 0 && (
              <Card className="p-12 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">找不到符合條件的廟宇</h3>
                <p className="text-gray-500 mt-1">請嘗試其他搜尋條件</p>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {showModal === 'detail' && selectedTemple && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">廟宇詳情</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(null)}>
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-temple-gradient rounded-lg flex items-center justify-center">
                  <Lantern size="lg" color="gold" animate={false} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedTemple.name}</h3>
                  <p className="text-gray-500">{selectedTemple.city} · {selectedTemple.mainGod}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">總訂單</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedTemple.totalOrders}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">總營收</div>
                  <div className="text-2xl font-bold text-temple-red-600">${selectedTemple.totalRevenue.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">聯絡電話</span>
                  <span className="text-gray-900">{selectedTemple.contact}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{selectedTemple.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">加入日期</span>
                  <span className="text-gray-900">{selectedTemple.joinDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">評分</span>
                  <span className="text-gray-900 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {selectedTemple.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(null)}>
                關閉
              </Button>
              <Link href={`/temples/${selectedTemple.id}`} target="_blank">
                <Button variant="temple">
                  前往廟宇頁面
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
