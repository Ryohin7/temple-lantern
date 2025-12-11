'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, Search, Tag,
  Plus, Edit, Trash2, Eye, MapPin, LogOut, CheckCircle, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: Tag, label: '折扣碼管理', href: '/admin/coupons' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events', active: true },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

// 模擬活動資料
const mockEvents = [
  {
    id: 1,
    title: '2025新春祈福法會',
    slug: 'new-year-blessing-2025',
    temple: '艋舺龍山寺',
    templeSlug: 'longshan-temple',
    date: '2025-01-25',
    participants: 156,
    maxParticipants: 300,
    price: 2000,
    status: 'upcoming',
    isActive: true,
    revenue: 312000,
  },
  {
    id: 2,
    title: '元宵節點燈祈福',
    slug: 'yuanxiao-lantern-2025',
    temple: '臺北行天宮',
    templeSlug: 'xingtian-temple',
    date: '2025-02-12',
    participants: 89,
    maxParticipants: 200,
    price: 1500,
    status: 'upcoming',
    isActive: true,
    revenue: 133500,
  },
  {
    id: 3,
    title: '中元普度法會',
    slug: 'zhongyuan-pudu-2024',
    temple: '臺北霞海城隍廟',
    templeSlug: 'xiahai-temple',
    date: '2024-08-18',
    participants: 200,
    maxParticipants: 200,
    price: 1800,
    status: 'completed',
    isActive: false,
    revenue: 360000,
  },
]

export default function AdminEventsPage() {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredEvents = events.filter(event => {
    const matchSearch = event.title.includes(searchQuery) || event.temple.includes(searchQuery)
    const matchStatus = statusFilter === 'all' || event.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleToggleActive = (id: number) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, isActive: !e.isActive } : e
    ))
  }

  const handleDelete = (id: number) => {
    if (confirm('確定要刪除這個活動嗎？')) {
      setEvents(events.filter(e => e.id !== id))
      alert('活動已刪除')
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
                  <CalendarDays className="w-6 h-6 text-temple-red-600" />
                  法會活動管理
                </h1>
                <p className="text-gray-500 text-sm">管理平台上的法會活動</p>
              </div>
              <Link href="/admin/events/new">
                <Button variant="temple">
                  <Plus className="w-4 h-4 mr-2" />
                  新增活動
                </Button>
              </Link>
            </div>
          </header>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900">{events.length}</div>
                  <div className="text-gray-500">總活動數</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {events.filter(e => e.status === 'upcoming').length}
                  </div>
                  <div className="text-gray-500">即將舉辦</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {events.reduce((sum, e) => sum + e.participants, 0)}
                  </div>
                  <div className="text-gray-500">總報名人數</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-temple-gold-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-temple-gold-600">
                    ${events.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-500">總營收</div>
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
                      placeholder="搜尋活動名稱或廟宇..."
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
                    <option value="upcoming">即將舉辦</option>
                    <option value="completed">已結束</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center text-3xl">
                            🙏
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                              {event.status === 'upcoming' ? (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  即將舉辦
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                  已結束
                                </span>
                              )}
                              {!event.isActive && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                  已停用
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-sm flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {event.temple}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-4 h-4" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.participants}/{event.maxParticipants} 人
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xl font-bold text-temple-red-600">
                              ${event.revenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              報名費 ${event.price}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleActive(event.id)}
                            >
                              {event.isActive ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-1 text-red-500" />
                                  停用
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                  啟用
                                </>
                              )}
                            </Button>
                            <Link href={`/events/${event.slug}`} target="_blank">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/events/${event.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(event.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <Card className="p-12 text-center">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">找不到活動</h3>
                <p className="text-gray-500 mt-1">請嘗試其他搜尋條件或建立新活動</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
