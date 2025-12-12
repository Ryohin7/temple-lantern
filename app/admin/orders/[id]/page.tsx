'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ShoppingBag, User, Building2, Calendar, Clock,
  CheckCircle, AlertCircle, CreditCard, MapPin, Phone, Mail,
  FileText, Download, Flame, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬訂單詳情資料（之後會從 Supabase 讀取）
const getOrderDetail = (orderId: string) => {
  return {
    id: orderId,
    createdAt: '2024-12-10 14:30:25',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: '信用卡',
    paymentDate: '2024-12-10 14:32:00',
    user: {
      id: 'user-001',
      name: '王大明',
      email: 'wang@example.com',
      phone: '0912-345-678',
    },
    temple: {
      id: 'temple-001',
      name: '艋舺龍山寺',
      address: '台北市萬華區廣州街211號',
      phone: '02-2302-5162',
    },
    items: [
      {
        id: 'item-001',
        lanternName: '光明燈',
        quantity: 2,
        price: 1200,
        duration: '一年',
        believerName: '王大明',
        birthDate: '民國 75 年 8 月 15 日',
        wishText: '祈求闔家平安，事業順利',
      },
      {
        id: 'item-002',
        lanternName: '平安燈',
        quantity: 1,
        price: 1000,
        duration: '一年',
        believerName: '王小美',
        birthDate: '民國 80 年 3 月 20 日',
        wishText: '學業進步，考試順利',
      },
    ],
    subtotal: 3400,
    discount: 0,
    total: 3400,
    couponCode: null,
    timeline: [
      { status: '訂單成立', time: '2024-12-10 14:30:25', completed: true },
      { status: '付款完成', time: '2024-12-10 14:32:00', completed: true },
      { status: '廟方確認', time: '2024-12-10 15:00:00', completed: true },
      { status: '點燈完成', time: '2024-12-10 16:30:00', completed: true },
    ],
    notes: '',
  }
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState<ReturnType<typeof getOrderDetail> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    // 模擬載入資料
    setTimeout(() => {
      const orderId = params.id as string
      setOrder(getOrderDetail(orderId))
      setLoading(false)
    }, 500)
  }, [params.id])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            已完成
          </span>
        )
      case 'lighting':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Flame className="w-4 h-4" />
            點燈中
          </span>
        )
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
            <Clock className="w-4 h-4" />
            待處理
          </span>
        )
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            已取消
          </span>
        )
      default:
        return null
    }
  }

  const getPaymentBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          已付款
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
        待付款
      </span>
    )
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl animate-bounce">🏮</div>
          <p className="text-gray-600 mt-4">載入中...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">找不到訂單</h2>
          <p className="text-gray-600 mb-4">訂單編號 {params.id} 不存在</p>
          <Link href="/admin/orders">
            <Button variant="temple">返回訂單列表</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-temple-red-600" />
                訂單詳情
              </h1>
              <p className="text-gray-500 text-sm font-mono">{order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            {getPaymentBadge(order.paymentStatus)}
          </div>
        </div>
      </header>

      <div className="p-8 max-w-6xl mx-auto">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-temple-red-600" />
                訂單進度
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                {order.timeline.map((step, i) => (
                  <div key={i} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <div className="text-center mt-2">
                        <div className="font-medium text-sm">{step.status}</div>
                        <div className="text-xs text-gray-500">
                          {step.time.split(' ')[1]}
                        </div>
                      </div>
                    </div>
                    {i < order.timeline.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flame className="w-5 h-5 text-temple-red-600" />
                    點燈項目
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item, i) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-temple-gradient rounded-lg flex items-center justify-center">
                            <Lantern size="sm" color="gold" animate={false} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {item.lanternName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {item.duration} | x{item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-temple-red-700">
                          NT$ {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 pt-3">
                        <div>
                          <span className="text-gray-500">點燈信眾：</span>
                          <span className="font-medium">{item.believerName}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">生辰：</span>
                          <span>{item.birthDate}</span>
                        </div>
                        {item.wishText && (
                          <div className="col-span-2">
                            <span className="text-gray-500">祈願：</span>
                            <span className="text-temple-red-700">{item.wishText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>小計</span>
                      <span>NT$ {order.subtotal.toLocaleString()}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>折扣 ({order.couponCode})</span>
                        <span>-NT$ {order.discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>訂單總額</span>
                      <span className="text-temple-red-700">
                        NT$ {order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Temple Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-temple-red-600" />
                    廟宇資訊
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                      <Lantern size="md" color="gold" animate={false} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.temple.name}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1 text-sm">
                        <MapPin className="w-4 h-4" />
                        {order.temple.address}
                      </p>
                      <p className="text-gray-600 flex items-center gap-1 text-sm">
                        <Phone className="w-4 h-4" />
                        {order.temple.phone}
                      </p>
                    </div>
                    <Link href={`/admin/temples`}>
                      <Button variant="outline" size="sm">
                        查看廟宇
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-temple-red-600" />
                    訂購人資訊
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{order.user.name}</div>
                      <div className="text-sm text-gray-500">會員</div>
                    </div>
                  </div>
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {order.user.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {order.user.phone}
                    </div>
                  </div>
                  <Link href={`/admin/users`}>
                    <Button variant="outline" size="sm" className="w-full">
                      查看會員資料
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-temple-red-600" />
                    付款資訊
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">付款方式</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">付款狀態</span>
                    <span className="font-medium text-green-600">
                      {order.paymentStatus === 'paid' ? '已付款' : '待付款'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">付款時間</span>
                    <span>{order.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">訂單時間</span>
                    <span>{order.createdAt}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-temple-red-600" />
                    操作
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    匯出訂單資料
                  </Button>
                  {order.status === 'pending' && (
                    <Button variant="temple" className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      確認訂單
                    </Button>
                  )}
                  {order.status !== 'cancelled' && order.status !== 'completed' && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      取消訂單
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
