'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Calendar, Clock, MapPin, Users, Flame, 
  CheckCircle, Share2, Heart, Phone, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lantern } from '@/components/temple/Lantern'

// 模擬活動詳情
const mockEvent = {
  id: 1,
  slug: 'new-year-blessing-2025',
  title: '2025新春祈福法會',
  temple: {
    name: '艋舺龍山寺',
    address: '台北市萬華區廣州街211號',
    phone: '02-2302-5162',
  },
  date: '2025-01-25',
  time: '09:00 - 17:00',
  location: '龍山寺正殿',
  description: '迎接金蛇年，龍山寺將舉辦盛大的新春祈福法會，由住持帶領眾法師誦經祈福，為信眾祈求新年平安順利、闘家安康、事業興旺。活動包含法師誦經、點燈祈願、過火儀式等傳統儀式，參與者可獲得龍山寺特製福袋一份。',
  price: 2000,
  participants: 156,
  maxParticipants: 300,
  category: '新春法會',
  status: 'upcoming',
  highlights: [
    { icon: '🙏', title: '法師誦經祈福', desc: '由住持帶領誦經' },
    { icon: '🏮', title: '點燈祈願', desc: '為自己和家人點燈' },
    { icon: '🔥', title: '過火儀式', desc: '傳統過火消災' },
    { icon: '🎁', title: '領取福袋', desc: '精美福袋一份' },
  ],
  schedule: [
    { time: '09:00', activity: '報到登記' },
    { time: '09:30', activity: '開場儀式' },
    { time: '10:00', activity: '法師誦經祈福' },
    { time: '12:00', activity: '午餐休息（提供素齋）' },
    { time: '13:30', activity: '點燈祈願儀式' },
    { time: '15:00', activity: '過火儀式' },
    { time: '16:00', activity: '發放福袋' },
    { time: '17:00', activity: '活動結束' },
  ],
  notes: [
    '請穿著端莊服裝，避免過於暴露',
    '法會期間請保持肅靜',
    '可自備供品（水果、餅乾等）',
    '提供素食午餐，請事先告知葷素',
    '活動當天請提早15分鐘報到',
  ],
}

export default function EventDetailPage() {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    participants: 1,
    dietary: 'vegetarian',
    notes: '',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    alert('報名成功！我們會寄送確認信至您的信箱。')
    setShowRegisterForm(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🏮</div>
      </div>
    )
  }

  const event = mockEvent
  const spotsLeft = event.maxParticipants - event.participants

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-temple-gold-50">
      {/* Hero */}
      <section className="relative h-80 bg-temple-gradient overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Lantern size="lg" color="gold" animate />
          </motion.div>
        </div>
        <div className="absolute top-4 left-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white bg-black/20 px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            返回活動列表
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="container mx-auto">
            <span className="inline-block px-3 py-1 bg-temple-red-600 text-white rounded-full text-sm mb-3">
              {event.category}
            </span>
            <h1 className="text-4xl font-temple font-bold text-white drop-shadow-lg">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-temple-red-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-temple-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">活動日期</div>
                        <div className="font-bold">{event.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-temple-red-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-temple-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">活動時間</div>
                        <div className="font-bold">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-temple-red-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-temple-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">活動地點</div>
                        <div className="font-bold">{event.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-temple-red-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-temple-red-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">報名人數</div>
                        <div className="font-bold">{event.participants}/{event.maxParticipants} 人</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">活動亮點</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {event.highlights.map((item, i) => (
                      <div key={i} className="text-center p-4 bg-temple-gold-50 rounded-lg">
                        <div className="text-4xl mb-2">{item.icon}</div>
                        <div className="font-bold text-temple-red-800">{item.title}</div>
                        <div className="text-sm text-gray-600">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">活動流程</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.schedule.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-20 text-temple-red-700 font-bold font-mono">
                          {item.time}
                        </div>
                        <div className="flex-1 p-3 bg-gray-50 rounded-lg">
                          {item.activity}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">注意事項</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {event.notes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Register Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-24"
            >
              <Card className="border-2 border-temple-gold-400">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-temple-red-700">
                      NT$ {event.price.toLocaleString()}
                    </div>
                    <div className="text-gray-500">/ 每人</div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">報名進度</span>
                      <span className="text-temple-red-700 font-bold">
                        剩餘 {spotsLeft} 名額
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-temple-gradient"
                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>

                  <Button 
                    variant="temple" 
                    size="lg" 
                    className="w-full"
                    onClick={() => setShowRegisterForm(true)}
                  >
                    立即報名
                  </Button>

                  <p className="text-center text-gray-500 text-xs mt-4">
                    報名後可在會員中心查看詳情
                  </p>
                </CardContent>
              </Card>

              {/* Temple Info */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Flame className="w-5 h-5 text-temple-red-600" />
                    主辦廟宇
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-temple-gradient rounded-lg flex items-center justify-center">
                      <Lantern size="md" color="gold" animate={false} />
                    </div>
                    <div>
                      <h3 className="font-bold text-temple-red-800">{event.temple.name}</h3>
                      <p className="text-sm text-gray-600">{event.temple.address}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {event.temple.phone}
                    </div>
                  </div>
                  <Link href="/temples/longshan-temple">
                    <Button variant="outline" size="sm" className="w-full mt-4 border-temple-gold-400">
                      查看廟宇詳情
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <h2 className="text-2xl font-temple font-bold text-temple-red-800">
                活動報名
              </h2>
              <p className="text-gray-600">{event.title}</p>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <Label htmlFor="name">姓名 *</Label>
                <Input
                  id="name"
                  required
                  className="mt-1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">電話 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  className="mt-1"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="mt-1"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="participants">報名人數</Label>
                <select
                  id="participants"
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} 人</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>餐食選擇</Label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dietary"
                      value="vegetarian"
                      checked={formData.dietary === 'vegetarian'}
                      onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    />
                    素食
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dietary"
                      value="meat"
                      checked={formData.dietary === 'meat'}
                      onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                    />
                    葷食
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="notes">備註</Label>
                <textarea
                  id="notes"
                  className="mt-1 w-full px-3 py-2 border rounded-lg min-h-[80px]"
                  placeholder="如有特殊需求請在此說明"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">費用小計</span>
                  <span className="text-2xl font-bold text-temple-red-700">
                    NT$ {(event.price * formData.participants).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRegisterForm(false)}
                  >
                    取消
                  </Button>
                  <Button type="submit" variant="temple" className="flex-1">
                    確認報名
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

