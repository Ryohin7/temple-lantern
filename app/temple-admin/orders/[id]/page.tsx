'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TempleAdminOrderDetailPage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
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
          <Button onClick={() => window.location.href = '/temple-admin/orders'}>返回列表</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/temple-admin/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          返回訂單列表
        </Link>

        <Card className="border-2 border-temple-gold-200">
          <CardHeader className="bg-temple-gold-50">
            <CardTitle className="text-2xl">訂單詳情 - {order.id}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">訂單資訊</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">訂單編號：</span>
                    <span className="font-mono">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">訂購時間：</span>
                    <span>{new Date(order.created_at).toLocaleString('zh-TW')}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">總金額：</span>
                    <span className="font-bold text-temple-red-700">NT$ {order.total_amount?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">狀態：</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                      }`}>
                      {order.status === 'completed' ? '已完成' : order.status === 'processing' ? '處理中' : '待處理'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">點燈項目</h3>
                <div className="space-y-2">
                  {order.order_items?.map((item: any, i: number) => (
                    <div key={i} className="p-4 bg-temple-gold-50 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.lantern_products?.name}</p>
                          <p className="text-sm text-gray-600">點燈人：{item.believer_name}</p>
                        </div>
                        <p className="font-bold">NT$ {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
