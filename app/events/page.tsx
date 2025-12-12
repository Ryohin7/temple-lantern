'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Users, Flame, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Lantern } from '@/components/temple/Lantern'
import { CloudDecoration, LotusDecoration } from '@/components/temple/TempleDecoration'

// 模擬法會活動資料
const mockEvents = [
  {
    id: 1,
    slug: 'new-year-blessing-2025',
    title: '2025新春祈福法會',
    temple: '艋舺龍山寺',
    date: '2025-01-25',
    time: '09:00 - 17:00',
    location: '龍山寺正殿',
    description: '迎接金蛇年，祈求新年平安順利、闔家安康',
    image: '/events/new-year.jpg',
    price: 2000,
    participants: 156,
    maxParticipants: 300,
    category: '新春法會',
    status: 'upcoming',
    highlights: ['法師誦經祈福', '點燈祈願', '過火儀式', '領取福袋'],
  },
  {
    id: 2,
    slug: 'yuanxiao-lantern-2025',
    title: '元宵節點燈祈福',
    temple: '臺北行天宮',
    date: '2025-02-12',
    time: '18:00 - 21:00',
    location: '行天宮廣場',
    description: '元宵佳節，點亮希望之燈，祈求一年好運',
    image: '/events/lantern.jpg',
    price: 1500,
    participants: 89,
    maxParticipants: 200,
    category: '元宵法會',
    status: 'upcoming',
    highlights: ['花燈展示', '祈福點燈', '猜燈謎', '湯圓品嚐'],
  },
  {
    id: 3,
    slug: 'qingming-memorial-2025',
    title: '清明超度法會',
    temple: '大甲鎮瀾宮',
    date: '2025-04-04',
    time: '08:00 - 16:00',
    location: '鎮瀾宮祭祀大殿',
    description: '清明時節，為先人祈福超度，表達孝思',
    image: '/events/qingming.jpg',
    price: 3000,
    participants: 45,
    maxParticipants: 150,
    category: '超度法會',
    status: 'upcoming',
    highlights: ['誦經超度', '焚燒金紙', '祭拜儀式', '供品準備'],
  },
  {
    id: 4,
    slug: 'mazu-birthday-2025',
    title: '媽祖聖誕慶典',
    temple: '大甲鎮瀾宮',
    date: '2025-04-21',
    time: '全日',
    location: '鎮瀾宮及周邊',
    description: '農曆三月二十三日，恭祝天上聖母聖誕千秋',
    image: '/events/mazu.jpg',
    price: 2500,
    participants: 320,
    maxParticipants: 500,
    category: '神明聖誕',
    status: 'upcoming',
    highlights: ['遶境活動', '祝壽大典', '藝文表演', '平安宴'],
  },
  {
    id: 5,
    slug: 'ghost-month-2024',
    title: '中元普度法會',
    temple: '臺北霞海城隍廟',
    date: '2024-08-18',
    time: '10:00 - 18:00',
    location: '城隍廟前廣場',
    description: '中元普度，超度孤魂，祈求平安',
    image: '/events/ghost.jpg',
    price: 1800,
    participants: 200,
    maxParticipants: 200,
    category: '中元法會',
    status: 'completed',
    highlights: ['放水燈', '普度法會', '焰口施食'],
  },
]

const categories = ['全部', '新春法會', '元宵法會', '超度法會', '神明聖誕', '中元法會']

export default function EventsPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredEvents = mockEvents.filter(event => {
    const matchCategory = selectedCategory === '全部' || event.category === selectedCategory
    const matchSearch = event.title.includes(searchQuery) || 
                       event.temple.includes(searchQuery) ||
                       event.description.includes(searchQuery)
    return matchCategory && matchSearch
  })

  const upcomingEvents = filteredEvents.filter(e => e.status === 'upcoming')
  const completedEvents = filteredEvents.filter(e => e.status === 'completed')

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-temple-gradient overflow-hidden">
        <div className="absolute inset-0 cloud-pattern opacity-20" />
        <CloudDecoration className="top-10 left-10" />
        <LotusDecoration className="bottom-10 right-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center gap-4"
            >
              <Lantern size="md" color="gold" animate />
              <Lantern size="lg" color="red" animate />
              <Lantern size="md" color="gold" animate />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-temple font-bold drop-shadow-lg"
            >
              �ثریعات 法會活動專區
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              參與各大廟宇法會活動，祈求平安、超度祖先、慶祝神明聖誕
            </motion.p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-80 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="搜尋法會活動..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-temple-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-12 bg-gradient-to-b from-white to-temple-gold-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-temple font-bold text-temple-red-800 mb-8 flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            即將舉辦的法會
            <span className="ml-2 px-3 py-1 bg-temple-red-100 text-temple-red-700 rounded-full text-sm">
              {upcomingEvents.length} 場
            </span>
          </h2>

          {upcomingEvents.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <div className="text-6xl mb-4">🙏</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">目前沒有符合的法會</h3>
                <p className="text-gray-500">請調整搜尋條件或查看其他分類</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/events/${event.slug}`}>
                    <Card className="h-full overflow-hidden hover:shadow-xl hover:border-temple-gold-400 transition-all group">
                      {/* Image */}
                      <div className="h-48 bg-temple-gradient flex items-center justify-center relative overflow-hidden">
                        <Lantern size="lg" color="gold" animate={false} />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-temple-red-600 text-white rounded-full text-sm font-medium">
                            {event.category}
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                          <div className="text-white text-sm flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="mb-2 text-sm text-temple-gold-600 flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          {event.temple}
                        </div>
                        <h3 className="text-xl font-temple font-bold text-temple-red-800 mb-2 group-hover:text-temple-red-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            已報名 {event.participants}/{event.maxParticipants} 人
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-temple-gradient"
                              style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-temple-red-700">
                            NT$ {event.price.toLocaleString()}
                          </span>
                          <Button variant="temple" size="sm">
                            立即報名
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

      {/* Completed Events */}
      {completedEvents.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-temple font-bold text-gray-600 mb-8">
              已結束的法會
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {completedEvents.map((event) => (
                <Card key={event.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{event.date}</div>
                    <h3 className="font-bold text-gray-700">{event.title}</h3>
                    <div className="text-sm text-gray-500">{event.temple}</div>
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                      已結束
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-temple-gradient">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-temple font-bold mb-4">
            您的廟宇想要舉辦法會活動嗎？
          </h2>
          <p className="mb-6 opacity-90">
            加入台灣點燈網，讓更多信眾參與您的法會活動
          </p>
          <Link href="/temple-admin/register">
            <Button variant="gold" size="lg">
              廟宇入駐申請
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}




