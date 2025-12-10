'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Users, Search, Eye, Ban, 
  Mail, Phone, Calendar, ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

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
  },
]

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredUsers = mockUsers.filter(user =>
    user.name.includes(searchQuery) || 
    user.email.includes(searchQuery) ||
    user.phone.includes(searchQuery)
  )

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
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-400" />
              用戶管理
            </h1>
            <p className="text-gray-400 text-sm mt-1">管理平台註冊用戶</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white">{mockUsers.length}</div>
              <div className="text-gray-400">總用戶數</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400">
                {mockUsers.filter(u => u.status === 'active').length}
              </div>
              <div className="text-gray-400">活躍用戶</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {mockUsers.reduce((sum, u) => sum + u.totalOrders, 0)}
              </div>
              <div className="text-gray-400">總訂單數</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-temple-gold-400">
                ${mockUsers.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">總消費金額</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                placeholder="搜尋用戶名稱、Email 或電話..."
                className="pl-10 bg-gray-700 border-gray-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">用戶</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">聯絡資訊</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">加入日期</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">訂單/消費</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">狀態</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-700 hover:bg-gray-700/50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-temple-gradient rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="font-medium text-white">{user.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300 text-sm flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-300 text-sm flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white flex items-center gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        {user.totalOrders} 筆
                      </div>
                      <div className="text-temple-gold-400 text-sm mt-1">
                        ${user.totalSpent.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status === 'active' ? '正常' : '已停權'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

