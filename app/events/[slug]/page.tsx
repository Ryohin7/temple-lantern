'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function EventDetailPage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [event, setEvent] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    if (params.slug) {
      fetchEvent(params.slug as string)
    }
  }, [params.slug])

  const fetchEvent = async (slug: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/events/${slug}`)
      if (res.ok) {
        const data = await res.json()
        setEvent(data)
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">找不到法會活動</p>
          <Button onClick={() => window.location.href = '/events'}>返回列表</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      <section className="bg-temple-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-white">
            <h1 className="text-4xl font-temple font-bold mb-4">{event.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(event.start_date).toLocaleDateString('zh-TW')} - {new Date(event.end_date).toLocaleDateString('zh-TW')}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.temples?.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-temple-gold-200">
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </div>

              {event.temples && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-bold mb-4">主辦廟宇</h3>
                  <Link href={`/temples/${event.temples.slug}`}>
                    <Card className="border-2 border-temple-gold-200 hover:border-temple-gold-400 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <h4 className="font-temple font-bold text-lg text-temple-red-800">
                          {event.temples.name}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-2">
                          <MapPin className="w-3 h-3" />
                          {event.temples.address}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
