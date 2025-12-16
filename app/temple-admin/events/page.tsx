'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, CalendarDays, Plus, Edit, Trash2, Eye,
  Search, Users, MapPin, DollarSign, CheckCircle, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

// 模擬活動資料
const mockEvents = [
  {
    id: 1,
    title: '2025新春祈福法會',
    date: '2025-01-25',
    time: '09:00',
    participants: 156,
    maxParticipants: 300,
    price: 2000,
    originalPrice: 2500,
    status: 'upcoming',
    isActive: true,
    revenue: 312000,
  },
  {
    id: 2,
    title: '元宵節點燈祈福',
    date: '2025-02-12',
    time: '18:00',
    participants: 89,
    maxParticipants: 200,
    price: 1500,
    originalPrice: 0,
    status: 'upcoming',
    isActive: true,
    revenue: 133500,
  },
  {
    id: 3,
    title: '中元普度法會',
    date: '2024-08-18',
    time: '07:00',
    participants: 200,
    maxParticipants: 200,
    price: 1800,
    originalPrice: 2000,
    status: 'completed',
    isActive: false,
    revenue: 360000,
  },
]

export default function TempleEventsPage() {
  const [mounted, setMounted] = useState(false)
  const [events, setEvents] = useState(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '09:00',
    description: '',
    price: 2000,
    originalPrice: 0,
    maxParticipants: 100,
    isActive: true,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredEvents = events.filter(event =>
    event.title.includes(searchQuery)
  )

  const handleToggleActive = (id: number) => {
    setEvents(events.map(e => 
      e.id === id ? { ...e, isActive: !e.isActive } : e
    ))
  }

  const handleDelete = (id: number) => {
    if (confirm('確定要刪除這個活動嗎？')) {
      setEvents(events.filter(e => e.id !== id))
    }
  }

  const handleEdit = (event: any) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      description: event.description || '',
      price: event.price,
      originalPrice: event.originalPrice || 0,
      maxParticipants: event.maxParticipants,
      isActive: event.isActive,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ))
    } else {
      const newEvent = {
        id: Date.now(),
        ...formData,
        participants: 0,
        status: 'upcoming',
        revenue: 0,
      }
      setEvents([newEvent, ...events])
    }

    setShowForm(false)
    setEditingEvent(null)
    setFormData({
      title: '',
      date: '',
      time: '09:00',
      description: '',
      price: 2000,
      originalPrice: 0,
      maxParticipants: 100,
      isActive: true,
    })
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-temple-gold-50">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-temple-gold-50">
      {/* Header */}
      <div className="bg-temple-red-700 border-b border-temple-gold-300 py-6 px-6">
        <div className="container mx-auto">
          <Link
            href="/temple-admin/dashboard"
            className="inline-flex items-center gap-2 text-temple-gold-200 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回後台
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-temple-gold-400" />
                法會活動管理
              </h1>
              <p className="text-temple-gold-200 text-sm mt-1">管理您廟宇的法會與活動</p>
            </div>
            <Button 
              className="bg-temple-gold-600 hover:bg-temple-gold-700 text-white"
              onClick={() => {
                setEditingEvent(null)
                setFormData({
                  title: '',
                  date: '',
                  time: '09:00',
                  description: '',
                  price: 2000,
                  originalPrice: 0,
                  maxParticipants: 100,
                  isActive: true,
                })
                setShowForm(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              新增活動
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-temple-gold-200 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{events.length}</div>
              <div className="text-gray-500">總活動數</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-temple-gold-200 shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {events.filter(e => e.status === 'upcoming').length}
              </div>
              <div className="text-gray-500">即將舉辦</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-temple-gold-200 shadow-sm border-l-4 border-l-green-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                {events.reduce((sum, e) => sum + e.participants, 0)}
              </div>
              <div className="text-gray-500">總報名人數</div>
            </CardContent>
          </Card>
          <Card className="bg-white border-temple-gold-200 shadow-sm border-l-4 border-l-temple-gold-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-temple-red-600">
                ${events.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}
              </div>
              <div className="text-gray-500">總營收</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-white border-temple-gold-200 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="搜尋活動..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white border-temple-gold-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                        <Lantern size="md" color="gold" animate={false} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                          {event.status === 'upcoming' ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              即將舉辦
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                              已結束
                            </span>
                          )}
                          {!event.isActive && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              已停用
                            </span>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {event.date} {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.participants}/{event.maxParticipants} 人
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {event.originalPrice > event.price ? (
                              <>
                                <span className="line-through text-gray-400">${event.originalPrice}</span>
                                <span className="text-temple-red-600 font-medium">${event.price}</span>
                              </>
                            ) : (
                              <span>${event.price}</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-temple-red-600">
                          ${event.revenue.toLocaleString()}
                        </div>
                        <div className="text-gray-500 text-sm">營收</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(event.id)}
                        >
                          {event.isActive ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1 text-red-500" />
                              停用
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                              啟用
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="bg-white border-temple-gold-200 shadow-sm text-center py-12">
            <CardContent>
              <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700">尚無活動</h3>
              <p className="text-gray-500 mt-1">點擊上方「新增活動」開始建立</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="p-6 border-b border-temple-gold-200 bg-temple-gold-50">
              <h2 className="text-xl font-bold text-temple-red-800">
                {editingEvent ? '編輯活動' : '新增活動'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label>活動名稱 *</Label>
                <Input
                  required
                  placeholder="如：2025新春祈福法會"
                  className="mt-1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>活動日期 *</Label>
                  <Input
                    type="date"
                    required
                    className="mt-1"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>開始時間 *</Label>
                  <Input
                    type="time"
                    required
                    className="mt-1"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>活動說明</Label>
                <textarea
                  rows={4}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-lg resize-none"
                  placeholder="請輸入活動詳細說明..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>報名費用 *</Label>
                  <Input
                    type="number"
                    required
                    min={0}
                    className="mt-1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>原價（選填，顯示折扣）</Label>
                  <Input
                    type="number"
                    min={0}
                    className="mt-1"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>名額上限 *</Label>
                  <Input
                    type="number"
                    required
                    min={1}
                    className="mt-1"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">立即發布</h4>
                  <p className="text-sm text-gray-500">開啟後活動將顯示在前台</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-temple-red-600"></div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingEvent(null)
                  }}
                >
                  取消
                </Button>
                <Button type="submit" variant="temple">
                  {editingEvent ? '儲存變更' : '建立活動'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}




