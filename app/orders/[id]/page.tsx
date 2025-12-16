'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Flame, Download, CheckCircle, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'

export default function OrderDetailPage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/orders/${id}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Failed to fetch order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReceipt = () => {
    if (!order) return

    setDownloading(true)

    const receiptHtml = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>點燈收據 - ${order.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Microsoft JhengHei', 'Noto Sans TC', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #8B0000;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #8B0000;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .order-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #FFF8DC;
      border-radius: 8px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      color: #8B0000;
      font-size: 18px;
      border-left: 4px solid #8B0000;
      padding-left: 10px;
      margin-bottom: 15px;
    }
    .temple-info {
      padding: 15px;
      background: #f9f9f9;
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #8B0000;
      color: white;
    }
    .total-row {
      font-weight: bold;
      font-size: 18px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
    @media print {
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏮 台灣點燈網</h1>
    <div class="subtitle">點燈收據 / Receipt</div>
  </div>

  <div class="order-info">
    <div>
      <strong>訂單編號：</strong>${order.id}<br>
      <strong>訂購日期：</strong>${new Date(order.created_at).toLocaleString('zh-TW')}
    </div>
    <div style="text-align: right;">
      <strong>付款狀態：</strong>${order.payment_status || '已付款'}
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">廟宇資訊</h2>
    <div class="temple-info">
      <h3>${order.temples?.name}</h3>
      <p>📍 ${order.temples?.address}</p>
      <p>📞 ${order.temples?.phone}</p>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">點燈明細</h2>
    <table>
      <thead>
        <tr>
          <th>燈種</th>
          <th>點燈人</th>
          <th>數量</th>
          <th style="text-align: right;">金額</th>
        </tr>
      </thead>
      <tbody>
        ${order.order_items?.map((item: any) => `
        <tr>
          <td>🏮 ${item.lantern_products?.name}</td>
          <td>${item.believer_name}</td>
          <td>${item.quantity}</td>
          <td style="text-align: right;">NT$ ${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="3" style="text-align: right;"><strong>總計</strong></td>
          <td style="text-align: right;"><strong>NT$ ${order.total_amount?.toLocaleString()}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="footer">
    <p>感謝您使用台灣點燈網，祝福您闔家平安、心想事成</p>
    <p style="margin-top: 10px; font-size: 12px;">
      此收據由系統自動產生 | 列印日期：${new Date().toLocaleString('zh-TW')}
    </p>
  </div>
</body>
</html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(receiptHtml)
      printWindow.document.close()
      printWindow.focus()

      setTimeout(() => {
        printWindow.print()
        setDownloading(false)
      }, 500)
    } else {
      alert('無法開啟列印視窗，請檢查瀏覽器是否阻擋彈出視窗')
      setDownloading(false)
    }
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">找不到訂單</p>
          <Button onClick={() => window.location.href = '/orders'}>返回訂單列表</Button>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-4 py-2 bg-green-500 text-white rounded-full font-medium">已完成</span>
      case 'processing':
        return <span className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium">處理中</span>
      case 'pending':
        return <span className="px-4 py-2 bg-yellow-500 text-white rounded-full font-medium">待處理</span>
      default:
        return null
    }
  }

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
              {getStatusBadge(order.status)}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid gap-6">
          {/* Temple Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                      {order.temples?.name}
                    </h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {order.temples?.address}
                    </p>
                    <p className="text-gray-600">
                      電話：{order.temples?.phone}
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
            transition={{ delay: 0.1 }}
          >
            <Card className="border-2 border-temple-gold-200">
              <CardHeader>
                <CardTitle className="text-lg">點燈項目</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {order.order_items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 bg-temple-gold-50 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">🏮</span>
                          <div>
                            <h4 className="font-bold text-temple-red-800">{item.lantern_products?.name}</h4>
                            <p className="text-sm text-gray-600">
                              x{item.quantity}
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
                          <span className="font-medium">{item.believer_name}</span>
                        </div>
                        {item.birth_date && (
                          <div>
                            <span className="text-gray-500">生辰：</span>
                            <span>{item.birth_date}</span>
                          </div>
                        )}
                      </div>
                      {item.wish_text && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">祈願：</span>
                          <span>{item.wish_text}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-end mt-6 pt-6 border-t">
                  <div className="text-right">
                    <span className="text-gray-500">訂單總額</span>
                    <div className="text-3xl font-bold text-temple-red-700">
                      NT$ {order.total_amount?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment & Order Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-temple-gold-200 h-full">
                <CardHeader>
                  <CardTitle className="text-lg">訂單資訊</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">訂單編號</span>
                    <span className="font-mono">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">訂購時間</span>
                    <span>{new Date(order.created_at).toLocaleString('zh-TW')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">付款狀態</span>
                    <span className="text-green-600 font-medium">{order.payment_status || '已付款'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
                    <span>{order.order_items?.[0]?.believer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">訂單狀態</span>
                    <span>{order.status === 'completed' ? '已完成' : order.status === 'processing' ? '處理中' : '待處理'}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              className="border-temple-gold-400"
              onClick={handleDownloadReceipt}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  產生中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  下載收據
                </>
              )}
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
