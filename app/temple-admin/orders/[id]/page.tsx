'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, 
  CheckCircle, Clock, Flame, Printer, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

// 模擬訂單資料
const mockOrder = {
  id: 'TL2024121001',
  date: '2024-12-10 14:30:25',
  status: 'pending',
  customer: {
    name: '王大明',
    email: 'wang@example.com',
    phone: '0912-345-678',
  },
  items: [
    {
      id: 1,
      lantern: '光明燈',
      quantity: 1,
      price: 1200,
      duration: '一年',
      believer: {
        name: '王大明',
        birthday: '民國 75 年 8 月 15 日',
        address: '台北市大安區復興南路100號',
      }
    },
    {
      id: 2,
      lantern: '平安燈',
      quantity: 2,
      price: 1000,
      duration: '一年',
      believer: {
        name: '王小美、王小華',
        birthday: '民國 77 年 3 月 20 日',
        address: '台北市大安區復興南路100號',
      }
    },
  ],
  total: 3200,
  payment: {
    method: '信用卡',
    status: '已付款',
    date: '2024-12-10 14:32:00',
  },
  notes: '請盡快點燈，謝謝',
  timeline: [
    { status: '訂單成立', time: '2024-12-10 14:30:25', completed: true },
    { status: '付款完成', time: '2024-12-10 14:32:00', completed: true },
    { status: '廟方確認', time: null, completed: false },
    { status: '點燈完成', time: null, completed: false },
  ],
}

export default function TempleOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [order, setOrder] = useState(mockOrder)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConfirm = () => {
    setProcessing(true)
    setTimeout(() => {
      setOrder({
        ...order,
        status: 'processing',
        timeline: order.timeline.map((t, i) =>
          i === 2 ? { ...t, completed: true, time: new Date().toLocaleString() } : t
        ),
      })
      setProcessing(false)
    }, 1000)
  }

  const handleComplete = () => {
    setProcessing(true)
    setTimeout(() => {
      setOrder({
        ...order,
        status: 'completed',
        timeline: order.timeline.map((t, i) =>
          i === 3 ? { ...t, completed: true, time: new Date().toLocaleString() } : t
        ),
      })
      setProcessing(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">已完成</span>
      case 'processing':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">處理中</span>
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">待處理</span>
      default:
        return null
    }
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
              <h1 className="text-2xl font-temple font-bold">訂單詳情</h1>
              <p className="text-white/80 font-mono">{order.id}</p>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
              <Button variant="outline" size="sm" className="bg-transparent border-white/50 text-white hover:bg-white/10">
                <Printer className="w-4 h-4 mr-2" />
                列印
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-6">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
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
                          <div className="text-xs text-gray-500">
                            {step.time ? step.time.split(' ')[1] : '待處理'}
                          </div>
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

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-8 pt-6 border-t">
                  {order.status === 'pending' && (
                    <Button 
                      variant="temple" 
                      onClick={handleConfirm}
                      disabled={processing}
                    >
                      {processing ? '處理中...' : '確認接單'}
                    </Button>
                  )}
                  {order.status === 'processing' && (
                    <Button 
                      variant="temple" 
                      onClick={handleComplete}
                      disabled={processing}
                    >
                      {processing ? '處理中...' : '完成點燈'}
                    </Button>
                  )}
                  {order.status === 'completed' && (
                    <Link href={`/certificate/${order.id}`}>
                      <Button variant="outline" className="border-temple-gold-400">
                        <FileText className="w-4 h-4 mr-2" />
                        查看證書
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-temple-red-600" />
                  訂購人資訊
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">姓名</div>
                      <div className="font-medium">{order.customer.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">電話</div>
                      <div className="font-medium">{order.customer.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{order.customer.email}</div>
                    </div>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-800">
                      <strong>備註：</strong>{order.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-temple-red-600" />
                  點燈項目
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.items.map((item, i) => (
                    <div key={item.id} className="p-4 bg-temple-gold-50 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                            <Lantern size="sm" color="gold" animate={false} />
                          </div>
                          <div>
                            <h4 className="font-bold text-temple-red-800 text-lg">{item.lantern}</h4>
                            <p className="text-gray-600 text-sm">
                              {item.duration} | x{item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-temple-red-700">
                          NT$ {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <div className="border-t border-temple-gold-200 pt-4">
                        <h5 className="font-medium text-gray-700 mb-2">信眾資料</h5>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-gray-500">點燈信眾</div>
                              <div className="font-medium">{item.believer.name}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-gray-500">生辰</div>
                              <div>{item.believer.birthday}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 md:col-span-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-gray-500">地址</div>
                              <div>{item.believer.address}</div>
                            </div>
                          </div>
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

          {/* Payment Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">付款資訊</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">付款方式</div>
                    <div className="font-medium">{order.payment.method}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">付款狀態</div>
                    <div className="font-medium text-green-600">{order.payment.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">付款時間</div>
                    <div className="font-medium">{order.payment.date}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}






