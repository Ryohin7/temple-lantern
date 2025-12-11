'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Flame, Download, CheckCircle, Clock, Truck, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬訂單詳情
const mockOrderDetail = {
  id: 'TL2024121001',
  date: '2024-12-10 14:30:25',
  temple: {
    name: '艋舺龍山寺',
    address: '台北市萬華區廣州街211號',
    phone: '02-2302-5162',
  },
  items: [
    { 
      name: '光明燈', 
      quantity: 1, 
      price: 1200,
      duration: '一年',
      believer: '王大明',
      birthday: '民國 75 年 8 月 15 日',
      address: '台北市大安區...'
    },
    { 
      name: '平安燈', 
      quantity: 2, 
      price: 1000,
      duration: '一年',
      believer: '王小美、王小華',
      birthday: '民國 77 年 3 月 20 日',
      address: '台北市大安區...'
    },
  ],
  total: 3200,
  status: 'completed',
  payment: {
    method: '信用卡',
    status: '已付款',
    date: '2024-12-10 14:32:00',
  },
  customer: {
    name: '王大明',
    email: 'wang@example.com',
    phone: '0912-345-678',
  },
  timeline: [
    { status: '訂單成立', time: '2024-12-10 14:30:25', completed: true },
    { status: '付款完成', time: '2024-12-10 14:32:00', completed: true },
    { status: '廟方確認', time: '2024-12-10 15:00:00', completed: true },
    { status: '點燈完成', time: '2024-12-10 16:30:00', completed: true },
  ],
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  const order = mockOrderDetail

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      {/* Header */}
      <section className="bg-temple-gradient py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white"
          >
            <Link 
              href="/orders"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              返回訂單列表
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-temple font-bold">訂單詳情</h1>
                <p className="text-lg opacity-90 font-mono mt-1">{order.id}</p>
              </div>
              <span className="px-4 py-2 bg-green-500 text-white rounded-full font-medium">
                已完成
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-6">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-2 border-temple-gold-200">
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <span>{i + 1}</span>
                          )}
                        </div>
                        <div className="text-center mt-2">
                          <div className="font-medium text-sm">{step.status}</div>
                          <div className="text-xs text-gray-500">{step.time.split(' ')[1]}</div>
                        </div>
                      </div>
                      {i < order.timeline.length - 1 && (
                        <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Temple Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-temple-gold-200">
              <CardHeader className="bg-temple-gold-50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-temple-red-600" />
                  廟宇資訊
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-temple-gradient rounded-lg flex items-center justify-center">
                    <Lantern size="md" color="gold" animate={false} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-temple font-bold text-temple-red-800">
                      {order.temple.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {order.temple.address}
                    </p>
                    <p className="text-gray-600">
                      電話：{order.temple.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-temple-gold-200">
              <CardHeader>
                <CardTitle className="text-lg">點燈項目</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.items.map((item, i) => (
                    <div key={i} className="p-4 bg-temple-gold-50 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🏮</span>
                          <div>
                            <h4 className="font-bold text-temple-red-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">
                              {item.duration} | x{item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-temple-red-700">
                          NT$ {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-temple-gold-200 pt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">點燈信眾：</span>
                          <span className="font-medium">{item.believer}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">生辰：</span>
                          <span>{item.birthday}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-end mt-6 pt-6 border-t">
                  <div className="text-right">
                    <span className="text-gray-500">訂單總額</span>
                    <div className="text-3xl font-bold text-temple-red-700">
                      NT$ {order.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment & Customer Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-2 border-temple-gold-200 h-full">
                <CardHeader>
                  <CardTitle className="text-lg">付款資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">付款方式</span>
                    <span>{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">付款狀態</span>
                    <span className="text-green-600 font-medium">{order.payment.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">付款時間</span>
                    <span>{order.payment.date}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-2 border-temple-gold-200 h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    訂購人資訊
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">姓名</span>
                    <span>{order.customer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">電子郵件</span>
                    <span>{order.customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">電話</span>
                    <span>{order.customer.phone}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" className="border-temple-gold-400">
              <Download className="w-4 h-4 mr-2" />
              下載收據
            </Button>
            <Button variant="temple" asChild>
              <Link href="/temples">再次點燈</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


