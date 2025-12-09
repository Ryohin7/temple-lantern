'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TempleCard } from '@/components/temple/TempleCard'
import { CloudDecoration, DragonDecoration } from '@/components/temple/TempleDecoration'
import { supabase } from '@/lib/supabase'

interface Temple {
  id: string
  name: string
  slug: string
  description: string | null
  address: string
  main_god: string
  banner_image: string | null
  logo_image: string | null
  theme_color: string
}

export default function TemplesPage() {
  const [temples, setTemples] = useState<Temple[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState<string>('all')

  useEffect(() => {
    fetchTemples()
  }, [])

  async function fetchTemples() {
    try {
      const { data, error } = await supabase
        .from('temples')
        .select('*')
        .eq('status', 'active')
        .order('name')

      if (error) throw error
      setTemples(data || [])
    } catch (error) {
      console.error('Error fetching temples:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         temple.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         temple.main_god.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCity = selectedCity === 'all' || temple.address.includes(selectedCity)
    
    return matchesSearch && matchesCity
  })

  const cities = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉義市']

  return (
    <div className="min-h-screen bg-gradient-to-b from-temple-red-50 via-white to-temple-gold-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-temple-gradient overflow-hidden">
        <div className="absolute inset-0 cloud-pattern opacity-20" />
        <CloudDecoration className="top-10 left-10" />
        <DragonDecoration className="top-10 right-10 opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-temple font-bold drop-shadow-lg"
            >
              🏯 廟宇列表
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              遍佈全台的合作廟宇，選擇離您最近或最有緣的廟宇
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl p-6 border-2 border-temple-gold-300"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜尋欄 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="搜尋廟宇名稱、地址或主神..."
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* 城市篩選 */}
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <Button
                variant={selectedCity === 'all' ? 'temple' : 'outline'}
                onClick={() => setSelectedCity('all')}
                className="border-temple-gold-300"
              >
                <MapPin className="w-4 h-4 mr-2" />
                全部地區
              </Button>
              {cities.map(city => (
                <Button
                  key={city}
                  variant={selectedCity === city ? 'temple' : 'outline'}
                  onClick={() => setSelectedCity(city)}
                  className="border-temple-gold-300 whitespace-nowrap"
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>

          {/* 搜尋結果數量 */}
          <div className="mt-4 text-sm text-gray-600">
            找到 <span className="font-bold text-temple-red-700">{filteredTemples.length}</span> 間廟宇
          </div>
        </motion.div>
      </section>

      {/* Temples Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🏮</div>
              <p className="text-gray-600">載入中...</p>
            </div>
          </div>
        ) : filteredTemples.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-2xl font-temple font-bold text-gray-700">
              沒有找到符合的廟宇
            </h3>
            <p className="text-gray-600">
              請試試其他搜尋關鍵字或地區
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemples.map((temple, i) => (
              <motion.div
                key={temple.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TempleCard {...temple} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

