'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Building2, ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">系統管理員儀表板</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">總用戶數</p>
                    <p className="text-3xl font-bold text-gray-900">-</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">廟宇數量</p>
                    <p className="text-3xl font-bold text-gray-900">-</p>
                  </div>
                  <Building2 className="w-12 h-12 text-green-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">總訂單數</p>
                    <p className="text-3xl font-bold text-gray-900">-</p>
                  </div>
                  <ShoppingBag className="w-12 h-12 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">總收入</p>
                    <p className="text-3xl font-bold text-gray-900">-</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-orange-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-xl font-bold mb-4">快速操作</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { href: '/admin/users', icon: Users, label: '用戶管理', color: 'blue' },
              { href: '/admin/temples', icon: Building2, label: '廟宇管理', color: 'green' },
              { href: '/admin/orders', icon: ShoppingBag, label: '訂單管理', color: 'purple' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-2 text-${item.color}-600`} />
                      <p className="font-medium">{item.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
