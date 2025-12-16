'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Calendar, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'

export default function AdminEventsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/events')
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

  const handleDelete = async (eventId: string) => {
    if (!confirm('確定要刪除此活動嗎？')) return

    try {
      const res = await fetch(`/api/admin/events?id=${eventId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('活動已刪除')
        fetchEvents()
      } else {
        alert('刪除失敗')
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('刪除失敗')
    }
  }

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!mounted) return null

  return (
    <AdminLayout>
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">活動管理</h1>
            <p className="text-gray-500 text-sm">管理法會活動</p>
          </div>
          <Link href="/admin/events/new">
            <Button variant="temple">
              <Plus className="w-4 h-4 mr-2" />
              新增活動
            </Button>
          </Link>
        </div>
      </header>

      <div className="p-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="搜尋活動..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-8 text-gray-500">載入中...</p>
          ) : filteredEvents.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700">尚無活動</h3>
              <p className="text-gray-500 mt-1 mb-4">新增第一個法會活動</p>
              <Link href="/admin/events/new">
                <Button variant="temple">
                  <Plus className="w-4 h-4 mr-2" />
                  新增活動
                </Button>
              </Link>
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(event.start_date).toLocaleDateString('zh-TW')} - {new Date(event.end_date).toLocaleDateString('zh-TW')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.temples?.name}</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link href={`/admin/events/${event.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
