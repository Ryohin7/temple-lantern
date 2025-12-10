'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, MapPin, Flame, Star, X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'

// 模擬廟宇資料
const mockTemples = [
  {
    id: 1,
    slug: 'longshan-temple',
    name: '艋舺龍山寺',
    city: '台北市',
    district: '萬華區',
    mainGod: '觀世音菩薩',
    rating: 4.8,
    reviews: 1250,
    lanternTypes: ['光明燈', '平安燈', '財神燈', '文昌燈'],
    priceRange: '800-3000',
    image: '/temples/longshan.jpg',
  },
  {
    id: 2,
    slug: 'xingtian-temple',
    name: '臺北行天宮',
    city: '台北市',
    district: '中山區',
    mainGod: '關聖帝君',
    rating: 4.9,
    reviews: 2100,
    lanternTypes: ['光明燈', '事業燈', '平安燈'],
    priceRange: '600-2500',
    image: '/temples/xingtian.jpg',
  },
  {
    id: 3,
    slug: 'xiahai-temple',
    name: '臺北霞海城隍廟',
    city: '台北市',
    district: '大同區',
    mainGod: '城隍爺、月下老人',
    rating: 4.7,
    reviews: 890,
    lanternTypes: ['月老燈', '姻緣燈', '平安燈'],
    priceRange: '500-2000',
    image: '/temples/xiahai.jpg',
  },
  {
    id: 4,
    slug: 'dajia-mazu',
    name: '大甲鎮瀾宮',
    city: '台中市',
    district: '大甲區',
    mainGod: '天上聖母',
    rating: 4.9,
    reviews: 3200,
    lanternTypes: ['光明燈', '平安燈', '太歲燈', '財神燈'],
    priceRange: '800-5000',
    image: '/temples/dajia.jpg',
  },
  {
    id: 5,
    slug: 'nankunshen',
    name: '南鯤鯓代天府',
    city: '台南市',
    district: '北門區',
    mainGod: '五府千歲',
    rating: 4.8,
    reviews: 1500,
    lanternTypes: ['光明燈', '平安燈', '補運燈'],
    priceRange: '600-2500',
    image: '/temples/nankunshen.jpg',
  },
]

// 所有燈種
const allLanternTypes = ['光明燈', '平安燈', '財神燈', '文昌燈', '月老燈', '姻緣燈', '太歲燈', '事業燈', '補運燈']

// 所有城市
const allCities = ['台北市', '新北市', '台中市', '台南市', '高雄市', '桃園市']

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState(mockTemples)
  const [showFilters, setShowFilters] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // 篩選條件
  const [filters, setFilters] = useState({
    city: '',
    lanternType: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    handleSearch()
  }, [query, filters])

  const handleSearch = () => {
    let filtered = mockTemples

    // 關鍵字搜尋
    if (query) {
      const q = query.toLowerCase()
      filtered = filtered.filter(temple =>
        temple.name.toLowerCase().includes(q) ||
        temple.mainGod.toLowerCase().includes(q) ||
        temple.city.includes(q) ||
        temple.district.includes(q) ||
        temple.lanternTypes.some(type => type.includes(q))
      )
    }

    // 城市篩選
    if (filters.city) {
      filtered = filtered.filter(temple => temple.city === filters.city)
    }

    // 燈種篩選
    if (filters.lanternType) {
      filtered = filtered.filter(temple => 
        temple.lanternTypes.includes(filters.lanternType)
      )
    }

    setResults(filtered)
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      lanternType: '',
      minPrice: '',
      maxPrice: '',
    })
  }

  const hasActiveFilters = filters.city || filters.lanternType || filters.minPrice || filters.maxPrice

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      {/* Search Header */}
      <section className="bg-temple-gradient py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center text-white mb-8">
              <h1 className="text-4xl font-temple font-bold mb-2">🔍 搜尋廟宇</h1>
              <p className="opacity-90">尋找您想要點燈祈福的廟宇</p>
            </div>

            {/* Search Bar - 修復跑版問題 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="搜尋廟宇名稱、神明、地區、燈種..."
                  className="w-full pl-12 pr-4 py-6 text-lg rounded-xl border-0 shadow-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                variant="temple"
                size="lg"
                className="h-auto py-4 px-8 rounded-xl whitespace-nowrap"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                搜尋
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['光明燈', '財神燈', '月老燈', '文昌燈'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, lanternType: type })}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    filters.lanternType === type
                      ? 'bg-white text-temple-red-600 font-medium'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4" />
                      篩選條件
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-temple-red-600 hover:underline"
                      >
                        清除
                      </button>
                    )}
                  </div>

                  {/* 城市 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      地區
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    >
                      <option value="">全部地區</option>
                      {allCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* 燈種 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      燈種
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={filters.lanternType}
                      onChange={(e) => setFilters({ ...filters, lanternType: e.target.value })}
                    >
                      <option value="">全部燈種</option>
                      {allLanternTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* 價格範圍 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      價格範圍
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="最低"
                        className="w-full"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      />
                      <span className="text-gray-500">~</span>
                      <Input
                        type="number"
                        placeholder="最高"
                        className="w-full"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  共找到 <span className="font-bold text-temple-red-600">{results.length}</span> 間廟宇
                </p>
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  篩選
                </Button>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {filters.city && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-temple-gold-100 text-temple-gold-800 rounded-full text-sm">
                      {filters.city}
                      <button onClick={() => setFilters({ ...filters, city: '' })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.lanternType && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-temple-red-100 text-temple-red-800 rounded-full text-sm">
                      {filters.lanternType}
                      <button onClick={() => setFilters({ ...filters, lanternType: '' })}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Results Grid */}
              {results.length > 0 ? (
                <div className="grid gap-6">
                  {results.map((temple, index) => (
                    <motion.div
                      key={temple.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/temples/${temple.slug}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-temple-gold-300">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-6">
                              {/* Image placeholder */}
                              <div className="w-32 h-32 bg-temple-gradient rounded-lg flex-shrink-0 flex items-center justify-center">
                                <Lantern size="lg" color="gold" animate={false} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-xl font-temple font-bold text-gray-900 mb-1">
                                      {temple.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {temple.city} {temple.district}
                                      </span>
                                      <span>主祀：{temple.mainGod}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-bold">{temple.rating}</span>
                                    <span className="text-gray-400 text-sm">({temple.reviews})</span>
                                  </div>
                                </div>

                                {/* Lantern Types */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {temple.lanternTypes.map((type) => (
                                    <span
                                      key={type}
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        filters.lanternType === type
                                          ? 'bg-temple-red-600 text-white'
                                          : 'bg-temple-gold-100 text-temple-gold-700'
                                      }`}
                                    >
                                      {type}
                                    </span>
                                  ))}
                                </div>

                                <div className="mt-3 text-sm text-gray-600">
                                  價格範圍：<span className="font-medium text-temple-red-600">${temple.priceRange}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">找不到符合條件的廟宇</h3>
                  <p className="text-gray-500 mb-4">請嘗試其他搜尋條件</p>
                  <Button variant="temple" onClick={clearFilters}>
                    清除篩選條件
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
