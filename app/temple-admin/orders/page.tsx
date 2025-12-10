'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, ShoppingBag, Search, Eye, Download, Filter,
  Calendar, Clock, CheckCircle, AlertCircle, FileSpreadsheet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 模擬訂單資料
const mockOrders = [
  { 
    id: 'TL2024121001', 
    date: '2024-12-10 14:30', 
    customer: '王○明', 
    phone: '0912-345-678',
    lantern: '光明燈', 
    quantity: 1,
    believer: '王大明',
    birthday: '1986-08-15',
    lunarBirthday: '農曆 七月十一',
    address: '台北市大安區復興南路100號',
    amount: 1200, 
    status: 'pending' 
  },
  { 
    id: 'TL2024121002', 
    date: '2024-12-10 15:20', 
    customer: '李○華', 
    phone: '0923-456-789',
    lantern: '財神燈', 
    quantity: 1,
    believer: '李小華',
    birthday: '1990-03-20',
    lunarBirthday: '農曆 二月廿四',
    address: '新北市板橋區中山路50號',
    amount: 1800, 
    status: 'pending' 
  },
  { 
    id: 'TL2024120901', 
    date: '2024-12-09 10:15', 
    customer: '陳○美', 
    phone: '0934-567-890',
    lantern: '平安燈', 
    quantity: 2,
    believer: '陳美玲、陳美華',
    birthday: '1988-05-10',
    lunarBirthday: '農曆 三月廿五',
    address: '台北市信義區松仁路88號',
    amount: 2000, 
    status: 'processing' 
  },
  { 
    id: 'TL2024120801', 
    date: '2024-12-08 09:00', 
    customer: '張○文', 
    phone: '0945-678-901',
    lantern: '月老燈', 
    quantity: 1,
    believer: '張文華',
    birthday: '1995-11-25',
    lunarBirthday: '農曆 十月初四',
    address: '台中市西屯區台灣大道100號',
    amount: 1500, 
    status: 'completed' 
  },
  { 
    id: 'TL2024120701', 
    date: '2024-12-07 16:45', 
    customer: '林○珍', 
    phone: '0956-789-012',
    lantern: '光明燈', 
    quantity: 3,
    believer: '林珍珠、林寶珠、林翠珠',
    birthday: '1975-02-28',
    lunarBirthday: '農曆 正月十八',
    address: '高雄市前鎮區中華路200號',
    amount: 3600, 
    status: 'completed' 
  },
]

export default function TempleOrdersPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // 篩選訂單
  const filteredOrders = mockOrders.filter(order => {
    // 搜尋
    const matchSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.includes(searchQuery) ||
      order.believer.includes(searchQuery) ||
      order.phone.includes(searchQuery)
    
    // 狀態篩選
    const matchStatus = statusFilter === 'all' || order.status === statusFilter
    
    // 日期篩選
    const orderDate = order.date.split(' ')[0]
    const matchDateFrom = !dateFrom || orderDate >= dateFrom
    const matchDateTo = !dateTo || orderDate <= dateTo
    
    return matchSearch && matchStatus && matchDateFrom && matchDateTo
  })

  // 統計
  const pendingCount = mockOrders.filter(o => o.status === 'pending').length
  const processingCount = mockOrders.filter(o => o.status === 'processing').length
  const completedCount = mockOrders.filter(o => o.status === 'completed').length

  // 下載報表
  const downloadReport = (type: 'all' | 'pending') => {
    const ordersToExport = type === 'pending' 
      ? filteredOrders.filter(o => o.status === 'pending' || o.status === 'processing')
      : filteredOrders

    // 生成 CSV 內容
    const headers = ['訂單編號', '訂單日期', '訂購人', '電話', '燈種', '數量', '點燈信眾', '國曆生日', '農曆生日', '地址', '金額', '狀態']
    const statusMap: { [key: string]: string } = { pending: '待處理', processing: '處理中', completed: '已完成' }
    
    const csvContent = [
      headers.join(','),
      ...ordersToExport.map(order => [
        order.id,
        order.date,
        order.customer,
        order.phone,
        order.lantern,
        order.quantity,
        order.believer,
        order.birthday,
        order.lunarBirthday,
        `"${order.address}"`,
        order.amount,
        statusMap[order.status]
      ].join(','))
    ].join('\n')

    // 下載
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `訂單報表_${type === 'pending' ? '未點燈' : '全部'}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" />已完成</span>
      case 'processing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1"><Clock className="w-3 h-3" />處理中</span>
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />待處理</span>
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
              <h1 className="text-2xl font-temple font-bold flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                訂單管理
              </h1>
              <p className="text-white/80 text-sm mt-1">管理點燈訂單與報表下載</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-transparent border-white/50 text-white hover:bg-white/10"
                onClick={() => downloadReport('pending')}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                下載未點燈報表
              </Button>
              <Button 
                variant="gold"
                onClick={() => downloadReport('all')}
              >
                <Download className="w-4 h-4 mr-2" />
                下載全部報表
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="cursor-pointer hover:border-temple-gold-400 transition-colors" onClick={() => setStatusFilter('all')}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{mockOrders.length}</div>
              <div className="text-gray-600 text-sm">總訂單</div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer hover:border-yellow-400 transition-colors ${statusFilter === 'pending' ? 'border-yellow-400 bg-yellow-50' : ''}`} onClick={() => setStatusFilter('pending')}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-gray-600 text-sm">待處理</div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer hover:border-blue-400 transition-colors ${statusFilter === 'processing' ? 'border-blue-400 bg-blue-50' : ''}`} onClick={() => setStatusFilter('processing')}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{processingCount}</div>
              <div className="text-gray-600 text-sm">處理中</div>
            </CardContent>
          </Card>
          <Card className={`cursor-pointer hover:border-green-400 transition-colors ${statusFilter === 'completed' ? 'border-green-400 bg-green-50' : ''}`} onClick={() => setStatusFilter('completed')}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{completedCount}</div>
              <div className="text-gray-600 text-sm">已完成</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              {/* 搜尋 */}
              <div className="flex-1 min-w-[200px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="搜尋訂單編號、姓名、電話..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* 日期範圍 */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <Input
                  type="date"
                  className="w-40"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span className="text-gray-400">~</span>
                <Input
                  type="date"
                  className="w-40"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              {/* 狀態篩選 */}
              <select 
                className="px-4 py-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">全部狀態</option>
                <option value="pending">待處理</option>
                <option value="processing">處理中</option>
                <option value="completed">已完成</option>
              </select>

              {/* 清除篩選 */}
              {(searchQuery || dateFrom || dateTo || statusFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setDateFrom('')
                    setDateTo('')
                    setStatusFilter('all')
                  }}
                >
                  清除篩選
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600">
            共 <span className="font-bold text-temple-red-700">{filteredOrders.length}</span> 筆訂單
            {statusFilter !== 'all' && (
              <span className="ml-2 text-sm">
                (篩選：{statusFilter === 'pending' ? '待處理' : statusFilter === 'processing' ? '處理中' : '已完成'})
              </span>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">沒有符合的訂單</h3>
                <p className="text-gray-500">請調整篩選條件</p>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${
                  order.status === 'pending' ? 'border-l-4 border-l-yellow-500' :
                  order.status === 'processing' ? 'border-l-4 border-l-blue-500' :
                  'border-l-4 border-l-green-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* 訂單基本資訊 */}
                        <div className="flex items-center gap-4 mb-3">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{order.id}</span>
                          {getStatusBadge(order.status)}
                          <span className="text-gray-500 text-sm">{order.date}</span>
                        </div>

                        {/* 燈種與金額 */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Lantern size="sm" color="red" animate={false} />
                            <span className="font-bold text-temple-red-800">{order.lantern}</span>
                            <span className="text-gray-500">x {order.quantity}</span>
                          </div>
                          <span className="text-xl font-bold text-temple-red-700">
                            NT$ {order.amount.toLocaleString()}
                          </span>
                        </div>

                        {/* 詳細資訊 */}
                        <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-gray-500 text-xs mb-1">訂購人</div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-gray-600">{order.phone}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs mb-1">點燈信眾</div>
                            <div className="font-medium">{order.believer}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs mb-1">生日</div>
                            <div className="font-medium">{order.birthday}</div>
                            <div className="text-sm text-temple-red-600">{order.lunarBirthday}</div>
                          </div>
                          <div>
                            <div className="text-gray-500 text-xs mb-1">地址</div>
                            <div className="text-sm">{order.address}</div>
                          </div>
                        </div>
                      </div>

                      {/* 操作按鈕 */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Link href={`/temple-admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-1" />
                            詳情
                          </Button>
                        </Link>
                        {order.status === 'pending' && (
                          <Button variant="temple" size="sm">
                            確認點燈
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button variant="temple" size="sm">
                            完成點燈
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

