'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Save, Bell, Shield, CreditCard, Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
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
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // TODO: 實作 /api/admin/settings API
      // const res = await fetch('/api/admin/settings')
      // if (res.ok) {
      //   const data = await res.json()
      //   setSettings(data)
      // }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      // TODO: 實作 /api/admin/settings API
      // const res = await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings),
      // })
      // if (res.ok) {
      //   alert('設定已儲存！')
      // }
      alert('設定已儲存！（待實作 API）')
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  }

  if (!mounted) return null

  return (
    <AdminLayout>
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-6 h-6 text-temple-red-600" />
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
        {loading ? (
          <p className="text-center py-8 text-gray-500">載入中...</p>
        ) : (
          <>
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
          </>
        )}
      </div>
    </AdminLayout>
  )
}
