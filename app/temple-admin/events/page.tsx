'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TempleAdminEventsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/temple-admin/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-temple font-bold text-temple-red-800">法會管理</h1>
            <p className="text-gray-600 mt-2">管理廟宇法會活動</p>
          </div>
          <Button variant="temple">
            <Plus className="w-4 h-4 mr-2" />
            新增法會
          </Button>
        </div>

        <div className="grid gap-6">
          {events.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">目前沒有法會活動</p>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="border-2 border-temple-gold-200">
                <CardHeader className="bg-temple-gold-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-sm ${event.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {event.status === 'active' ? '進行中' : '已結束'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.start_date).toLocaleDateString('zh-TW')} - {new Date(event.end_date).toLocaleDateString('zh-TW')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      編輯
                    </Button>
                    <Button variant="outline" className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      刪除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
