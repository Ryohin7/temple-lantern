'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Building2, Users, ShoppingBag, FileText, 
  DollarSign, Settings, Image, CalendarDays, LogOut, Save,
  Bell, Shield, Mail, CreditCard, Globe, Palette
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 導航選單
const navItems = [
  { icon: LayoutDashboard, label: '儀表板', href: '/admin/dashboard' },
  { icon: Building2, label: '廟宇管理', href: '/admin/temples' },
  { icon: Users, label: '用戶管理', href: '/admin/users' },
  { icon: ShoppingBag, label: '訂單管理', href: '/admin/orders' },
  { icon: CalendarDays, label: '活動管理', href: '/admin/events' },
  { icon: FileText, label: '內容管理', href: '/admin/content' },
  { icon: Image, label: '廣告管理', href: '/admin/banners' },
  { icon: DollarSign, label: '財務報表', href: '/admin/finance' },
  { icon: Settings, label: '系統設定', href: '/admin/settings', active: true },
]

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({
    siteName: '台灣點燈網',
    siteDescription: '線上祈福點燈平台',
    contactEmail: 'contact@temple-lantern.tw',
    contactPhone: '02-1234-5678',
    platformFeeRate: 5,
    minOrderAmount: 100,
    maxOrderAmount: 100000,
    enableRegistration: true,
    enableGoogleLogin: true,
    enableEmailNotification: true,
    enableSMSNotification: false,
    maintenanceMode: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    alert('設定已儲存！')
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
                  <Settings className="w-6 h-6 text-temple-red-600" />
                  系統設定
                </h1>
                <p className="text-gray-500 text-sm">平台全域設定與參數調整</p>
              </div>
              <Button onClick={handleSave} variant="temple">
                <Save className="w-4 h-4 mr-2" />
                儲存設定
              </Button>
            </div>
          </header>

          <div className="p-8 space-y-8">
            {/* 基本設定 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-temple-red-600" />
                    基本設定
                  </CardTitle>
                  <CardDescription>網站基本資訊設定</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        網站名稱
                      </label>
                      <Input
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        網站描述
                      </label>
                      <Input
                        value={settings.siteDescription}
                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        聯絡 Email
                      </label>
                      <Input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        聯絡電話
                      </label>
                      <Input
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 金流設定 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-temple-red-600" />
                    金流設定
                  </CardTitle>
                  <CardDescription>付款與抽成相關設定</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        平台抽成比例 (%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={settings.platformFeeRate}
                        onChange={(e) => setSettings({ ...settings, platformFeeRate: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最低訂單金額 (TWD)
                      </label>
                      <Input
                        type="number"
                        value={settings.minOrderAmount}
                        onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最高訂單金額 (TWD)
                      </label>
                      <Input
                        type="number"
                        value={settings.maxOrderAmount}
                        onChange={(e) => setSettings({ ...settings, maxOrderAmount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">綠界金流設定</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Merchant ID
                        </label>
                        <Input placeholder="請輸入綠界商店代號" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hash Key
                        </label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hash IV
                        </label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 會員設定 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-temple-red-600" />
                    會員設定
                  </CardTitle>
                  <CardDescription>會員註冊與登入相關設定</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">開放會員註冊</div>
                      <div className="text-sm text-gray-500">允許新用戶註冊帳號</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.enableRegistration}
                        onChange={(e) => setSettings({ ...settings, enableRegistration: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Google 登入</div>
                      <div className="text-sm text-gray-500">允許使用 Google 帳號登入</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.enableGoogleLogin}
                        onChange={(e) => setSettings({ ...settings, enableGoogleLogin: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 通知設定 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-temple-red-600" />
                    通知設定
                  </CardTitle>
                  <CardDescription>系統通知與提醒設定</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Email 通知</div>
                      <div className="text-sm text-gray-500">訂單確認、點燈完成等 Email 通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.enableEmailNotification}
                        onChange={(e) => setSettings({ ...settings, enableEmailNotification: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">簡訊通知</div>
                      <div className="text-sm text-gray-500">重要通知發送簡訊</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.enableSMSNotification}
                        onChange={(e) => setSettings({ ...settings, enableSMSNotification: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 維護模式 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Shield className="w-5 h-5" />
                    系統維護
                  </CardTitle>
                  <CardDescription>開啟維護模式將暫停所有前台功能</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-red-700">維護模式</div>
                      <div className="text-sm text-red-600">開啟後前台將顯示維護中頁面</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}






