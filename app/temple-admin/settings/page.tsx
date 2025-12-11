'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Settings, Building2, MapPin, Phone, Mail, 
  Globe, Clock, Image, Save, Upload, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

// 模擬廟宇資料
const mockTemple = {
  name: '艋舺龍山寺',
  slug: 'longshan-temple',
  mainGod: '觀世音菩薩',
  description: '艋舺龍山寺是台灣著名的古剎，創建於清乾隆三年（1738年），主祀觀世音菩薩。龍山寺不僅是宗教信仰中心，也是國家二級古蹟，每年吸引數百萬遊客參拜。',
  address: '台北市萬華區廣州街211號',
  city: '台北市',
  district: '萬華區',
  phone: '02-2302-5162',
  email: 'contact@longshan.org.tw',
  website: 'https://www.lungshan.org.tw',
  openingHours: '06:00 - 22:00',
  bankAccount: {
    bank: '台灣銀行',
    branch: '萬華分行',
    accountNumber: '012-123456789',
    accountName: '財團法人艋舺龍山寺',
  },
  notifications: {
    email: true,
    sms: false,
    newOrder: true,
    orderComplete: true,
  }
}

export default function TempleSettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState(mockTemple)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert('設定已儲存！')
    }, 1000)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-temple-gradient text-white py-6 px-6">
        <div className="container mx-auto">
          <Link
            href="/temple-admin/dashboard"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回後台
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-temple font-bold flex items-center gap-2">
                <Settings className="w-6 h-6" />
                廟宇設定
              </h1>
              <p className="text-white/80 text-sm mt-1">管理廟宇基本資料與設定</p>
            </div>
            <Link href={`/temples/${formData.slug}`} target="_blank">
              <Button variant="outline" className="bg-transparent border-white/50 text-white hover:bg-white/10">
                <Eye className="w-4 h-4 mr-2" />
                預覽頁面
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'basic', icon: <Building2 className="w-5 h-5" />, label: '基本資料' },
                    { id: 'contact', icon: <Phone className="w-5 h-5" />, label: '聯絡資訊' },
                    { id: 'payment', icon: <Settings className="w-5 h-5" />, label: '收款設定' },
                    { id: 'notification', icon: <Mail className="w-5 h-5" />, label: '通知設定' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === item.id
                          ? 'bg-temple-red-600 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">基本資料</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Temple Logo */}
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                      <div className="w-24 h-24 bg-temple-gradient rounded-lg flex items-center justify-center">
                        <Lantern size="lg" color="gold" animate={false} />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">廟宇圖片</h4>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          更換圖片
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">建議尺寸 400x400，JPG 或 PNG</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">廟宇名稱</Label>
                        <Input
                          id="name"
                          className="mt-1"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">網址代稱</Label>
                        <div className="flex items-center mt-1">
                          <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l-lg text-gray-500 text-sm">
                            /temples/
                          </span>
                          <Input
                            id="slug"
                            className="rounded-l-none"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="mainGod">主祀神明</Label>
                      <Input
                        id="mainGod"
                        className="mt-1"
                        value={formData.mainGod}
                        onChange={(e) => setFormData({ ...formData, mainGod: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">廟宇簡介</Label>
                      <textarea
                        id="description"
                        className="mt-1 w-full px-3 py-2 border rounded-lg min-h-[120px]"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Gallery */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      廟宇相簿
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-temple-gold-100 rounded-lg flex items-center justify-center">
                          <Lantern size="sm" color="red" animate={false} />
                        </div>
                      ))}
                      <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-temple-gold-400 transition-colors">
                        <input type="file" className="hidden" accept="image/*" />
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">新增圖片</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">聯絡資訊</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">地址</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="address"
                          className="pl-10"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">縣市</Label>
                        <Input
                          id="city"
                          className="mt-1"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="district">區域</Label>
                        <Input
                          id="district"
                          className="mt-1"
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">電話</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="phone"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">網站</Label>
                        <div className="relative mt-1">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="website"
                            type="url"
                            className="pl-10"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="openingHours">開放時間</Label>
                        <div className="relative mt-1">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="openingHours"
                            className="pl-10"
                            value={formData.openingHours}
                            onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">收款設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ 收款帳戶資料將用於平台撥款，請確認資料正確無誤。
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bank">銀行名稱</Label>
                        <Input
                          id="bank"
                          className="mt-1"
                          value={formData.bankAccount.bank}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            bankAccount: { ...formData.bankAccount, bank: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="branch">分行名稱</Label>
                        <Input
                          id="branch"
                          className="mt-1"
                          value={formData.bankAccount.branch}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            bankAccount: { ...formData.bankAccount, branch: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="accountNumber">帳戶號碼</Label>
                      <Input
                        id="accountNumber"
                        className="mt-1 font-mono"
                        value={formData.bankAccount.accountNumber}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          bankAccount: { ...formData.bankAccount, accountNumber: e.target.value }
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="accountName">戶名</Label>
                      <Input
                        id="accountName"
                        className="mt-1"
                        value={formData.bankAccount.accountName}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          bankAccount: { ...formData.bankAccount, accountName: e.target.value }
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notification Tab */}
            {activeTab === 'notification' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">通知設定</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Email 通知</h4>
                          <p className="text-sm text-gray-500">接收訂單與系統通知</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.notifications.email}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              notifications: { ...formData.notifications, email: e.target.checked }
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">新訂單通知</h4>
                          <p className="text-sm text-gray-500">有新訂單時立即通知</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.notifications.newOrder}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              notifications: { ...formData.notifications, newOrder: e.target.checked }
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">訂單完成通知</h4>
                          <p className="text-sm text-gray-500">訂單完成時通知信眾</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={formData.notifications.orderComplete}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              notifications: { ...formData.notifications, orderComplete: e.target.checked }
                            })}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <Button variant="temple" onClick={handleSave} disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    儲存中...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    儲存設定
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


