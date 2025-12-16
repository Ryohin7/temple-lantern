'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Flame, Calendar, Clock, MapPin, AlertTriangle, 
  CheckCircle, RefreshCw, Download, Bell, Settings,
  ChevronRight, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'
import { 
  mockUserLanterns, 
  calculateLanternStatus,
  type UserLantern 
} from '@/lib/notification'

export default function MyLanternsPage() {
  const [mounted, setMounted] = useState(false)
  const [lanterns, setLanterns] = useState<UserLantern[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired'>('all')
  const [reminderSettings, setReminderSettings] = useState({
    enableEmail: true,
    enableSMS: false,
    enablePush: true,
    reminderDays: [30, 7, 1],
  })

  useEffect(() => {
    setMounted(true)
    // 更新燈種狀態
    const updatedLanterns = mockUserLanterns.map(lantern => ({
      ...lantern,
      ...calculateLanternStatus(lantern.expiryDate),
    }))
    setLanterns(updatedLanterns as UserLantern[])
  }, [])

  const filteredLanterns = lanterns.filter(lantern => {
    if (filter === 'all') return true
    const { status } = calculateLanternStatus(lantern.expiryDate)
    return status === filter
  })

  const stats = {
    total: lanterns.length,
    active: lanterns.filter(l => calculateLanternStatus(l.expiryDate).status === 'active').length,
    expiringSoon: lanterns.filter(l => calculateLanternStatus(l.expiryDate).status === 'expiring_soon').length,
    expired: lanterns.filter(l => calculateLanternStatus(l.expiryDate).status === 'expired').length,
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-gold-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-temple font-bold text-temple-red-800 flex items-center gap-3">
              <Flame className="w-8 h-8" />
              我的燈種
            </h1>
            <p className="text-gray-600 mt-1">管理您的點燈紀錄與續燈</p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-temple-gold-300">
              <User className="w-4 h-4 mr-2" />
              返回會員中心
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card 
            className={`cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-temple-red-500' : ''}`}
            onClick={() => setFilter('all')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">全部燈種</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${filter === 'active' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setFilter('active')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-gray-500">點亮中</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${filter === 'expiring_soon' ? 'ring-2 ring-yellow-500' : ''}`}
            onClick={() => setFilter('expiring_soon')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">{stats.expiringSoon}</div>
              <div className="text-sm text-gray-500">即將到期</div>
            </CardContent>
          </Card>
          <Card 
            className={`cursor-pointer transition-all ${filter === 'expired' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setFilter('expired')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-600">{stats.expired}</div>
              <div className="text-sm text-gray-500">已到期</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 燈種列表 */}
          <div className="lg:col-span-2 space-y-4">
            {filteredLanterns.length === 0 ? (
              <Card className="p-12 text-center">
                <Lantern size="lg" color="gold" animate={false} />
                <h3 className="text-lg font-medium text-gray-700 mt-4">
                  {filter === 'all' ? '您尚未點燈' : '沒有符合條件的燈種'}
                </h3>
                <p className="text-gray-500 mt-2">
                  {filter === 'all' && '前往廟宇為自己和家人點一盞明燈吧！'}
                </p>
                {filter === 'all' && (
                  <Link href="/temples" className="mt-4 inline-block">
                    <Button variant="temple">開始點燈</Button>
                  </Link>
                )}
              </Card>
            ) : (
              filteredLanterns.map((lantern, index) => {
                const { status, daysLeft } = calculateLanternStatus(lantern.expiryDate)
                
                return (
                  <motion.div
                    key={lantern.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`overflow-hidden ${
                      status === 'expiring_soon' ? 'border-yellow-400 border-2' :
                      status === 'expired' ? 'border-red-400 border-2 opacity-75' : ''
                    }`}>
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* 燈籠圖示 */}
                          <div className={`w-24 flex-shrink-0 flex items-center justify-center ${
                            status === 'expired' ? 'bg-gray-100' : 'bg-temple-gradient'
                          }`}>
                            <Lantern 
                              size="md" 
                              color={status === 'expired' ? 'gold' : 'gold'} 
                              animate={status !== 'expired'} 
                            />
                          </div>

                          {/* 內容 */}
                          <div className="flex-1 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-gray-900">{lantern.lanternType}</h3>
                                  {status === 'active' && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      點亮中
                                    </span>
                                  )}
                                  {status === 'expiring_soon' && (
                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      {daysLeft} 天後到期
                                    </span>
                                  )}
                                  {status === 'expired' && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                      已到期
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                  <MapPin className="w-3 h-3" />
                                  {lantern.templeName}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  信眾：{lantern.believerName}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                點燈：{lantern.lightingDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                到期：{lantern.expiryDate}
                              </span>
                            </div>

                            {/* 操作按鈕 */}
                            <div className="flex gap-2 mt-4">
                              {status !== 'expired' && lantern.certificateUrl && (
                                <Link href={`/certificate/${lantern.orderId}`}>
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-1" />
                                    點燈證書
                                  </Button>
                                </Link>
                              )}
                              {(status === 'expiring_soon' || status === 'expired') && (
                                <Link href={`/temples/${lantern.templeSlug}`}>
                                  <Button variant="temple" size="sm">
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    {status === 'expired' ? '重新點燈' : '續燈'}
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* 側邊欄 - 提醒設定 */}
          <div className="space-y-6">
            {/* 到期提醒設定 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5 text-temple-gold-600" />
                  到期提醒設定
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Email 通知</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={reminderSettings.enableEmail}
                      onChange={(e) => setReminderSettings({
                        ...reminderSettings,
                        enableEmail: e.target.checked
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">簡訊通知</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={reminderSettings.enableSMS}
                      onChange={(e) => setReminderSettings({
                        ...reminderSettings,
                        enableSMS: e.target.checked
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">站內通知</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={reminderSettings.enablePush}
                      onChange={(e) => setReminderSettings({
                        ...reminderSettings,
                        enablePush: e.target.checked
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    提前提醒天數
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[30, 14, 7, 3, 1].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const days = reminderSettings.reminderDays.includes(day)
                            ? reminderSettings.reminderDays.filter(d => d !== day)
                            : [...reminderSettings.reminderDays, day]
                          setReminderSettings({ ...reminderSettings, reminderDays: days })
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          reminderSettings.reminderDays.includes(day)
                            ? 'bg-temple-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {day} 天
                      </button>
                    ))}
                  </div>
                </div>

                <Button variant="temple" className="w-full mt-4">
                  儲存設定
                </Button>
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/temples" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    新增點燈
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/orders" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    訂單紀錄
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full justify-between">
                    帳戶設定
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}





