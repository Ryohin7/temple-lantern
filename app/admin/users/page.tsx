'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, Search, 
  Eye, Ban, Mail, Phone, Calendar, LogOut, CheckCircle,
  ShoppingCart, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users', active: true },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings' },
]

// 模擬用戶資料
const mockUsers = [
  {
    id: 1,
    name: '王大明',
    email: 'wang@example.com',
    phone: '0912-345-678',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 18600,
    status: 'active',
    avatar: '王',
    lastLogin: '2024-12-10 14:30',
  },
  {
    id: 2,
    name: '李小華',
    email: 'lee@example.com',
    phone: '0923-456-789',
    joinDate: '2024-02-20',
    totalOrders: 8,
    totalSpent: 12800,
    status: 'active',
    avatar: '李',
    lastLogin: '2024-12-09 18:20',
  },
  {
    id: 3,
    name: '陳美玲',
    email: 'chen@example.com',
    phone: '0934-567-890',
    joinDate: '2024-03-10',
    totalOrders: 5,
    totalSpent: 7500,
    status: 'active',
    avatar: '陳',
    lastLogin: '2024-12-08 09:15',
  },
  {
    id: 4,
    name: '張建國',
    email: 'zhang@example.com',
    phone: '0945-678-901',
    joinDate: '2024-04-05',
    totalOrders: 3,
    totalSpent: 4500,
    status: 'suspended',
    avatar: '張',
    lastLogin: '2024-11-25 20:00',
  },
  {
    id: 5,
    name: '林雅婷',
    email: 'lin@example.com',
    phone: '0956-789-012',
    joinDate: '2024-05-12',
    totalOrders: 15,
    totalSpent: 23400,
    status: 'active',
    avatar: '林',
    lastLogin: '2024-12-10 16:45',
  },
]

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [users, setUsers] = useState(mockUsers)
  const [showModal, setShowModal] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.includes(searchQuery) || 
      user.email.includes(searchQuery) ||
      user.phone.includes(searchQuery)
    const matchStatus = statusFilter === 'all' || user.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleSuspend = (userId: number) => {
    if (confirm('確定要停權此用戶嗎？')) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: 'suspended' } : u
      ))
      alert('用戶已停權')
    }
  }

  const handleReactivate = (userId: number) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'active' } : u
    ))
    alert('用戶已恢復正常')
  }

  const openDetailModal = (user: typeof mockUsers[0]) => {
    setSelectedUser(user)
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
                  <Users className="w-6 h-6 text-temple-red-600" />
                  用戶管理
                </h1>
                <p className="text-gray-500 text-sm">管理平台註冊用戶</p>
              </div>
            </div>
          </header>

          <div className="p-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-gray-500">總用戶數</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </div>
                  <div className="text-gray-500">活躍用戶</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {users.reduce((sum, u) => sum + u.totalOrders, 0)}
                  </div>
                  <div className="text-gray-500">總訂單數</div>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-temple-gold-500">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-temple-gold-600">
                    ${users.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}
                  </div>
                  <div className="text-gray-500">總消費金額</div>
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
                      placeholder="搜尋用戶名稱、Email 或電話..."
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
                    <option value="active">正常</option>
                    <option value="suspended">已停權</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">用戶</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">聯絡資訊</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">加入日期</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">訂單/消費</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">狀態</th>
                      <th className="text-left py-4 px-6 text-gray-600 font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-temple-gradient rounded-full flex items-center justify-center text-white font-bold">
                              {user.avatar}
                            </div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-700 text-sm flex items-center gap-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user.email}
                          </div>
                          <div className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {user.phone}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-700 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {user.joinDate}
                          </div>
                          <div className="text-gray-400 text-xs mt-1">
                            最後登入：{user.lastLogin}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900 flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4 text-gray-400" />
                            {user.totalOrders} 筆
                          </div>
                          <div className="text-temple-red-600 font-medium text-sm mt-1">
                            ${user.totalSpent.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {user.status === 'active' ? '正常' : '已停權'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openDetailModal(user)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              查看
                            </Button>
                            {user.status === 'active' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleSuspend(user.id)}
                              >
                                <Ban className="w-4 h-4 mr-1" />
                                停權
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleReactivate(user.id)}
                              >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                恢復
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {filteredUsers.length === 0 && (
              <Card className="p-12 text-center mt-4">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-700">找不到符合條件的用戶</h3>
                <p className="text-gray-500 mt-1">請嘗試其他搜尋條件</p>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {showModal === 'detail' && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">用戶詳情</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowModal(null)}>
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-temple-gradient rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedUser.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedUser.status === 'active' ? '正常' : '已停權'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">總訂單</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedUser.totalOrders} 筆</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-gray-500 text-sm">總消費</div>
                  <div className="text-2xl font-bold text-temple-red-600">${selectedUser.totalSpent.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">手機號碼</span>
                  <span className="text-gray-900">{selectedUser.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">加入日期</span>
                  <span className="text-gray-900">{selectedUser.joinDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">最後登入</span>
                  <span className="text-gray-900">{selectedUser.lastLogin}</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(null)}>
                關閉
              </Button>
              <Link href={`/admin/orders?user=${selectedUser.id}`}>
                <Button variant="temple">
                  查看訂單
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
