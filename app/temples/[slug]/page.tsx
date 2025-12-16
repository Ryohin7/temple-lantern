'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Flame, Clock, Info, CalendarDays, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LanternCard } from '@/components/temple/LanternCard'
import { CloudDecoration, IncenseSmoke } from '@/components/temple/TempleDecoration'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import { toast } from '@/components/ui/use-toast'

interface Temple {
  id: string
  name: string
  description: string | null
  address: string
  phone: string | null
  email: string | null
  main_god: string
  history: string | null
  banner_image: string | null
  logo_image: string | null
  theme_color: string
}

interface LanternProduct {
  id: string
  temple_id: string
  name: string
  description: string
  benefits: string
  price: number
  duration_months: number
  stock: number
  image: string | null
  category: string
}

export default function TempleDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [temple, setTemple] = useState<Temple | null>(null)
  const [lanterns, setLanterns] = useState<LanternProduct[]>([])
  const [loading, setLoading] = useState(true)

  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    if (slug) {
      fetchTempleData()
    }
  }, [slug])

  async function fetchTempleData() {
    try {
      // Fetch temple
      const { data: templeData, error: templeError } = await supabase
        .from('temples')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single()

      if (templeError) throw templeError
      setTemple(templeData)

      // Fetch lanterns
      if (templeData) {
        const { data: lanternsData, error: lanternsError } = await supabase
          .from('lantern_products')
          .select('*')
          .eq('temple_id', templeData.id)
          .eq('is_active', true)
          .order('price')

        if (lanternsError) throw lanternsError
        setLanterns(lanternsData || [])
      }
    } catch (error) {
      console.error('Error fetching temple data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (lantern: LanternProduct) => {
    if (!temple) return

    addItem({
      lanternId: lantern.id,
      lanternName: lantern.name,
      lanternImage: lantern.image,
      templeId: temple.id,
      templeName: temple.name,
      price: lantern.price,
      quantity: 1,
      believerName: '',
    })

    // Show toast notification (you'll need to implement the toast component)
    alert(`已將 ${lantern.name} 加入購物車！`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🏮</div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😢</div>
          <h2 className="text-2xl font-temple font-bold text-gray-700">
            找不到此廟宇
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="relative h-[400px] overflow-hidden">
        {temple.banner_image ? (
          <Image
            src={temple.banner_image}
            alt={temple.name}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${temple.theme_color} 0%, #ea580c 100%)`
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* 裝飾 */}
        <CloudDecoration className="top-10 left-10" />
        <IncenseSmoke />

        {/* Temple Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end gap-6">
              {temple.logo_image && (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={temple.logo_image}
                    alt={`${temple.name} Logo`}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="text-white pb-2">
                <h1 className="text-5xl font-temple font-bold drop-shadow-lg mb-3">
                  {temple.name}
                </h1>
                <div className="flex items-center gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-temple-gold-400" />
                    <span>主祀：{temple.main_god}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-temple-gold-400" />
                    <span>{temple.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Temple Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2 border-temple-gold-300 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-2xl font-temple font-bold text-temple-red-800 flex items-center gap-2">
                  <Info className="w-6 h-6" />
                  廟宇資訊
                </h3>

                <div className="space-y-3">
                  {temple.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-temple-gold-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">聯絡電話</div>
                        <a href={`tel:${temple.phone}`} className="text-temple-red-700 hover:underline">
                          {temple.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {temple.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-temple-gold-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">電子郵件</div>
                        <a href={`mailto:${temple.email}`} className="text-temple-red-700 hover:underline break-all">
                          {temple.email}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-temple-gold-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500">廟宇地址</div>
                      <p className="text-gray-700">{temple.address}</p>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-temple-gold-300 hover:bg-temple-gold-50"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.address)}`)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Google 地圖導航
                </Button>
              </CardContent>
            </Card>

            {temple.history && (
              <Card className="border-2 border-temple-gold-300 shadow-lg">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-2xl font-temple font-bold text-temple-red-800">
                    🏯 廟宇歷史
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {temple.history}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Lanterns & Events */}
          <div className="lg:col-span-2 space-y-8">
            {/* 點燈項目 */}
            <div>
              <h2 className="text-3xl font-temple font-bold text-temple-red-800 mb-6 flex items-center gap-3">
                <Flame className="w-8 h-8 text-temple-gold-500" />
                點燈項目
              </h2>

              {lanterns.length === 0 ? (
                <Card className="border-2 border-temple-gold-200">
                  <CardContent className="p-12 text-center space-y-4">
                    <div className="text-6xl">🏮</div>
                    <p className="text-gray-600">
                      此廟宇尚未開放線上點燈服務
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lanterns.map((lantern, i) => (
                    <motion.div
                      key={lantern.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <LanternCard
                        {...lantern}
                        onAddToCart={() => handleAddToCart(lantern)}
                        onViewDetails={() => { }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



