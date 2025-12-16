'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { User, ShoppingBag, Flame, Settings, LogOut, Bell, Download, Save, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

export default function UserDashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  // 真實資料狀態
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [lanterns, setLanterns] = useState<any[]>([])

  // 用戶資料表單狀態
  const [userForm, setUserForm] = useState({
    name: '',
    phone: '',
    email: '',
  })

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // 獲取用戶資料
      const profileRes = await fetch('/api/user/profile')
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setUser(profileData)
        setUserForm({
          name: profileData.name || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
        })
      }

      // 獲取訂單
      const ordersRes = await fetch('/api/orders')
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

      // 獲取點燈記錄
      const lanternsRes = await fetch('/api/user/lanterns')
      if (lanternsRes.ok) {
        const lanternsData = await lanternsRes.json()
        setLanterns(lanternsData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaveSuccess(false)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userForm.name,
          phone: userForm.phone,
        }),
      })

      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        alert('儲存失敗，請稍後再試')
      }
    } catch (error) {
      console.error('儲存失敗:', error)
      alert('儲存失敗，請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    const { signOut } = await import('@/lib/auth')
    await signOut()
    window.location.href = '/'
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">請先登入</p>
          <Button onClick={() => window.location.href = '/login'}>前往登入</Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">已完成</span>
      case 'processing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">處理中</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">待付款</span>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-gold-50 to-white">
      {/* Header */}
      <div className="bg-temple-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-lg">
              👤
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-temple font-bold">{user.name || '用戶'}</h1>
              <p className="opacity-80">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-temple-gold-200 sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'overview', icon: <User className="w-5 h-5" />, label: '帳戶總覽' },
                    { id: 'orders', icon: <ShoppingBag className="w-5 h-5" />, label: '我的訂單' },
                    { id: 'lanterns', icon: <Flame className="w-5 h-5" />, label: '我的點燈' },
                    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: '帳戶設定' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                          ? 'bg-temple-red-600 text-white'
                          : 'hover:bg-temple-gold-100 text-gray-700'
                        }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <hr className="my-4 border-temple-gold-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    登出
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-temple-gold-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-2">📦</div>
                      <div className="text-3xl font-bold text-temple-red-700">{user.totalOrders || 0}</div>
                      <div className="text-gray-600">總訂單數</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-temple-gold-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-2">🏮</div>
                      <div className="text-3xl font-bold text-temple-red-700">{user.totalLanterns || 0}</div>
                      <div className="text-gray-600">點燈次數</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-temple-gold-200">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-2">⭐</div>
                      <div className="text-3xl font-bold text-temple-red-700">會員</div>
                      <div className="text-gray-600">會員等級</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders */}
                <Card className="border-2 border-temple-gold-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-temple text-temple-red-800">
                      最近訂單
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">目前沒有訂單記錄</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-temple-gold-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-temple-red-800">{order.temples?.name}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(order.created_at).toLocaleDateString('zh-TW')}
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <div className="text-lg font-bold text-temple-red-700 mt-1">
                                NT$ {order.total_amount?.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-temple-gold-300"
                      onClick={() => setActiveTab('orders')}
                    >
                      查看所有訂單
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-2 border-temple-gold-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-temple text-temple-red-800">
                      快速操作
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/temples">
                      <Button variant="outline" className="w-full h-24 flex-col border-temple-gold-200">
                        <Flame className="w-8 h-8 mb-2 text-temple-red-600" />
                        <span>點燈祈福</span>
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full h-24 flex-col border-temple-gold-200">
                      <Download className="w-8 h-8 mb-2 text-temple-red-600" />
                      <span>下載證明</span>
                    </Button>
                    <Button variant="outline" className="w-full h-24 flex-col border-temple-gold-200">
                      <Bell className="w-8 h-8 mb-2 text-temple-red-600" />
                      <span>通知設定</span>
                    </Button>
                    <Button variant="outline" className="w-full h-24 flex-col border-temple-gold-200" onClick={() => setActiveTab('settings')}>
                      <Settings className="w-8 h-8 mb-2 text-temple-red-600" />
                      <span>帳戶設定</span>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-temple-gold-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-temple text-temple-red-800">
                      我的訂單
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">目前沒有訂單記錄</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <Link key={order.id} href={`/orders/${order.id}`}>
                            <div className="border border-temple-gold-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="text-sm text-gray-500">訂單編號</div>
                                  <div className="font-mono font-bold">{order.id}</div>
                                </div>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="flex items-center gap-4 mb-4">
                                <Lantern size="sm" color="red" animate={false} />
                                <div className="flex-1">
                                  <div className="font-bold text-temple-red-800">{order.temples?.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString('zh-TW')}
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="text-xl font-bold text-temple-red-700">
                                  NT$ {order.total_amount?.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Lanterns */}
            {activeTab === 'lanterns' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-temple-gold-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-temple text-temple-red-800">
                      我的點燈記錄
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {lanterns.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">目前沒有點燈記錄</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lanterns.map((lantern) => (
                          <Card key={lantern.id} className="border border-temple-gold-200">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <Lantern size="md" color="red" animate />
                                <div className="flex-1">
                                  <div className="font-bold text-temple-red-800">{lantern.lantern_name}</div>
                                  <div className="text-sm text-gray-600">點燈人：{lantern.believer_name}</div>
                                  <div className="text-sm text-gray-600">{lantern.temple_name}</div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {lantern.start_date} ~ {lantern.expiry_date}
                                  </div>
                                </div>
                                <div className="text-2xl">✨</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-2 border-temple-gold-200">
                  <CardHeader>
                    <CardTitle className="text-xl font-temple text-temple-red-800">
                      帳戶設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {saveSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>帳戶資料已成功更新！</span>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userName">姓名</Label>
                        <Input
                          id="userName"
                          type="text"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          className="mt-1"
                          placeholder="請輸入姓名"
                        />
                      </div>
                      <div>
                        <Label htmlFor="userPhone">電話</Label>
                        <Input
                          id="userPhone"
                          type="tel"
                          value={userForm.phone}
                          onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                          className="mt-1"
                          placeholder="0912-345-678"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="userEmail">電子郵件</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={userForm.email}
                          className="mt-1 bg-gray-50"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">電子郵件無法變更</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="temple"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            儲存中...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            儲存變更
                          </>
                        )}
                      </Button>
                      <Button variant="outline" className="border-temple-gold-300">
                        變更密碼
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
