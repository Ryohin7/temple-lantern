'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Calendar, Plus, Edit, Trash2, Eye, 
  Search, Filter, Users, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// 模擬活動資料
const mockEvents = [
  {
    id: 1,
    title: '2025新春祈福法會',
    temple: '艋舺龍山寺',
    date: '2025-01-25',
    participants: 156,
    maxParticipants: 300,
    status: 'upcoming',
    revenue: 312000,
  },
  {
    id: 2,
    title: '元宵節點燈祈福',
    temple: '臺北行天宮',
    date: '2025-02-12',
    participants: 89,
    maxParticipants: 200,
    status: 'upcoming',
    revenue: 133500,
  },
  {
    id: 3,
    title: '中元普度法會',
    temple: '臺北霞海城隍廟',
    date: '2024-08-18',
    participants: 200,
    maxParticipants: 200,
    status: 'completed',
    revenue: 360000,
  },
]

export default function AdminEventsPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 py-6 px-6">
        <div className="container mx-auto">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            返回後台
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-400" />
                法會活動管理
              </h1>
              <p className="text-gray-400 text-sm mt-1">管理平台上的法會活動</p>
            </div>
            <Link href="/admin/events/new">
              <Button className="bg-temple-gold-600 hover:bg-temple-gold-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                新增活動
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white">{mockEvents.length}</div>
              <div className="text-gray-400">總活動數</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {mockEvents.filter(e => e.status === 'upcoming').length}
              </div>
              <div className="text-gray-400">即將舉辦</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400">
                ${mockEvents.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">總營收</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="搜尋活動..."
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                <option>全部狀態</option>
                <option>即將舉辦</option>
                <option>已結束</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          {mockEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center text-3xl">
                        🙏
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{event.title}</h3>
                        <div className="text-gray-400 text-sm flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.temple}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.participants}/{event.maxParticipants}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-temple-gold-400">
                          ${event.revenue.toLocaleString()}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          event.status === 'upcoming' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {event.status === 'upcoming' ? '即將舉辦' : '已結束'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/events/${event.id}`} target="_blank">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/20">
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
      </div>
    </div>
  )
}

