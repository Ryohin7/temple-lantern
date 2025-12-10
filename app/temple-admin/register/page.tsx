'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Building2, Mail, Phone, MapPin, User, Lock, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CloudDecoration, DragonDecoration } from '@/components/temple/TempleDecoration'

export default function TempleRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // 廟宇資訊
    templeName: '',
    address: '',
    phone: '',
    email: '',
    mainGod: '',
    description: '',
    // 管理員資訊
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('密碼與確認密碼不符')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert('申請已送出！我們將在 1-3 個工作天內審核您的申請，並以 Email 通知您。')
      router.push('/')
    }, 2000)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 to-white py-12 relative overflow-hidden">
      {/* 背景裝飾 */}
      <div className="absolute inset-0 cloud-pattern opacity-20" />
      <CloudDecoration className="top-10 left-10" />
      <DragonDecoration className="top-10 right-10 opacity-20" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-temple font-bold text-temple-red-800 mb-4 flex items-center justify-center gap-3">
            <Building2 className="w-12 h-12" />
            廟宇註冊申請
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            加入台灣點燈網，讓您的廟宇服務更多信眾
            <br />
            提供線上點燈服務，提升廟務管理效率
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* 廟宇基本資訊 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-temple-gold-300 shadow-lg">
                <CardHeader className="bg-temple-gold-50">
                  <CardTitle className="text-2xl font-temple text-temple-red-800 flex items-center gap-2">
                    <Building2 className="w-6 h-6" />
                    廟宇基本資訊
                  </CardTitle>
                  <CardDescription>
                    請填寫廟宇的基本資料
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="templeName">廟宇名稱 *</Label>
                      <Input
                        id="templeName"
                        required
                        placeholder="例：艋舺龍山寺"
                        value={formData.templeName}
                        onChange={(e) => handleChange('templeName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mainGod">主祀神明 *</Label>
                      <div className="relative">
                        <Flame className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-temple-gold-600" />
                        <Input
                          id="mainGod"
                          required
                          placeholder="例：觀世音菩薩"
                          value={formData.mainGod}
                          onChange={(e) => handleChange('mainGod', e.target.value)}
                          className="mt-1 pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">廟宇地址 *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-temple-gold-600" />
                      <Input
                        id="address"
                        required
                        placeholder="完整地址（含縣市區域）"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="mt-1 pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">聯絡電話 *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-temple-gold-600" />
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="02-XXXX-XXXX"
                          value={formData.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="mt-1 pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">廟宇信箱 *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-temple-gold-600" />
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="temple@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          className="mt-1 pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">廟宇簡介（選填）</Label>
                    <textarea
                      id="description"
                      placeholder="簡述廟宇歷史、特色等..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="mt-1 w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 管理員資訊 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-temple-gold-300 shadow-lg">
                <CardHeader className="bg-temple-gold-50">
                  <CardTitle className="text-2xl font-temple text-temple-red-800 flex items-center gap-2">
                    <User className="w-6 h-6" />
                    管理員帳號資訊
                  </CardTitle>
                  <CardDescription>
                    設定登入廟宇管理後台的帳號
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminName">管理員姓名 *</Label>
                      <Input
                        id="adminName"
                        required
                        placeholder="請輸入真實姓名"
                        value={formData.adminName}
                        onChange={(e) => handleChange('adminName', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminPhone">管理員手機 *</Label>
                      <Input
                        id="adminPhone"
                        type="tel"
                        required
                        placeholder="09XX-XXX-XXX"
                        value={formData.adminPhone}
                        onChange={(e) => handleChange('adminPhone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="adminEmail">登入信箱 *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      required
                      placeholder="admin@example.com"
                      value={formData.adminEmail}
                      onChange={(e) => handleChange('adminEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">設定密碼 *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-temple-gold-600" />
                        <Input
                          id="password"
                          type="password"
                          required
                          placeholder="至少 8 個字元"
                          value={formData.password}
                          onChange={(e) => handleChange('password', e.target.value)}
                          className="mt-1 pl-10"
                          minLength={8}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">確認密碼 *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-temple-gold-600" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          required
                          placeholder="再次輸入密碼"
                          value={formData.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          className="mt-1 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 注意事項 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-xl">ℹ️</span>
                    申請流程說明
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• 提交申請後，我們將在 <strong>1-3 個工作天</strong>內完成審核</li>
                    <li>• 審核通過後，將以 Email 通知並開通管理後台權限</li>
                    <li>• 您可以登入管理後台新增點燈商品、管理訂單等</li>
                    <li>• 平台將收取 <strong>訂單金額 5%</strong> 作為服務費用</li>
                    <li>• 如有任何問題，歡迎聯繫我們的客服團隊</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* 提交按鈕 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.back()}
                className="flex-1 border-temple-gold-300"
              >
                取消
              </Button>
              <Button
                type="submit"
                variant="temple"
                size="lg"
                disabled={loading}
                className="flex-1"
              >
                {loading ? '處理中...' : '提交申請'}
              </Button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}


