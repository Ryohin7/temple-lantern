'use client'

import { useState, useEffect } from 'react'
import { Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // TODO: 實作 /api/admin/users API
      // const res = await fetch('/api/admin/users')
      // if (res.ok) {
      //   const data = await res.json()
      //   setUsers(data)
      // }
      setUsers([])
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) return null

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">用戶管理</h1>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="搜尋用戶..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <p className="text-center py-8 text-gray-500">載入中...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center py-8 text-gray-500">沒有找到用戶</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">姓名</th>
                      <th className="text-left py-3 px-4">電子郵件</th>
                      <th className="text-left py-3 px-4">角色</th>
                      <th className="text-left py-3 px-4">註冊日期</th>
                      <th className="text-right py-3 px-4">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                              user.role === 'temple_admin' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {user.role === 'admin' ? '系統管理員' :
                              user.role === 'temple_admin' ? '廟宇管理員' : '一般用戶'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(user.created_at).toLocaleDateString('zh-TW')}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="outline" size="sm" className="mr-2">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
