'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, MapPin, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

export default function SearchPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [temples, setTemples] = useState<any[]>([])
  const [filteredTemples, setFilteredTemples] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setMounted(true)
    fetchTemples()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = temples.filter(temple =>
        temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        temple.address?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredTemples(filtered)
    } else {
      setFilteredTemples(temples)
    }
  }, [searchTerm, temples])

  const fetchTemples = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/temples')
      if (res.ok) {
        const data = await res.json()
        setTemples(data)
        setFilteredTemples(data)
      }
    } catch (error) {
      console.error('Failed to fetch temples:', error)
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
      {/* Header */}
      <section className="bg-temple-gradient py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-temple font-bold mb-4">搜尋廟宇</h1>
            <p className="text-lg opacity-90">找到最適合您的點燈廟宇</p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="搜尋廟宇名稱或地址..."
              className="pl-12 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-600">找到 {filteredTemples.length} 間廟宇</p>
          </div>

          {filteredTemples.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <p className="text-gray-500 mb-4">找不到符合的廟宇</p>
                <Button variant="temple" onClick={() => setSearchTerm('')}>
                  清除搜尋
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemples.map((temple, index) => (
                <motion.div
                  key={temple.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/temples/${temple.slug}`}>
                    <Card className="border-2 border-temple-gold-200 hover:border-temple-gold-400 transition-all hover:shadow-lg cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                            <Lantern size="sm" color="gold" animate={false} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-temple font-bold text-lg text-temple-red-800">
                              {temple.name}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {temple.city}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {temple.address}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Flame className="w-4 h-4 text-temple-red-600" />
                            {temple.lantern_products?.length || 0} 種燈種
                          </span>
                          <Button variant="outline" size="sm">
                            查看詳情
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
