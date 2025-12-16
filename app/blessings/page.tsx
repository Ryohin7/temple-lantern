'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, Flame, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CloudDecoration, LotusDecoration } from '@/components/temple/TempleDecoration'
import { Lantern } from '@/components/temple/Lantern'

// 模擬祈福留言
const mockBlessings = [
  {
    id: 1,
    name: '王○明',
    message: '祈求全家平安健康，事事順心如意。',
    temple: '艋舺龍山寺',
    date: '2024-12-10',
    likes: 23
  },
  {
    id: 2,
    name: '李○華',
    message: '感謝神明保佑，考試順利上榜！',
    temple: '臺北行天宮',
    date: '2024-12-09',
    likes: 45
  },
  {
    id: 3,
    name: '陳○美',
    message: '祈願爸媽身體健康，長命百歲。',
    temple: '艋舺龍山寺',
    date: '2024-12-08',
    likes: 67
  },
  {
    id: 4,
    name: '張○文',
    message: '祈求姻緣美滿，早日遇見對的人。',
    temple: '臺北霞海城隍廟',
    date: '2024-12-07',
    likes: 89
  },
  {
    id: 5,
    name: '林○珍',
    message: '感謝媽祖保佑，生意興隆，財源廣進。',
    temple: '大甲鎮瀾宮',
    date: '2024-12-06',
    likes: 34
  },
  {
    id: 6,
    name: '黃○強',
    message: '祈求工作順利，升遷加薪。',
    temple: '臺北行天宮',
    date: '2024-12-05',
    likes: 56
  },
]

export default function BlessingsPage() {
  const [blessings, setBlessings] = useState(mockBlessings)
  const [newMessage, setNewMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLike = (id: number) => {
    setBlessings(prev =>
      prev.map(b =>
        b.id === id ? { ...b, likes: b.likes + 1 } : b
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const newBlessing = {
      id: Date.now(),
      name: '匿名信眾',
      message: newMessage,
      temple: '台灣點燈網',
      date: new Date().toISOString().split('T')[0],
      likes: 0
    }

    setBlessings([newBlessing, ...blessings])
    setNewMessage('')
    setShowForm(false)
  }

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
              🙏 祈福留言板
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              分享您的祈願與感謝，讓祝福傳遞給每一個人
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="gold"
                size="lg"
                onClick={() => setShowForm(!showForm)}
              >
                <Flame className="w-5 h-5 mr-2" />
                寫下祈福
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Submit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-temple-gold-50 border-y-2 border-temple-gold-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8">
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <Card className="border-2 border-temple-gold-300 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-temple font-bold text-temple-red-800 mb-4 flex items-center gap-2">
                      <Flame className="w-5 h-5" />
                      寫下您的祈福
                    </h3>
                    <div className="space-y-4">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="寫下您的祈願、感謝或祝福..."
                        className="w-full min-h-[120px] px-4 py-3 rounded-lg border-2 border-temple-gold-200 focus:border-temple-red-400 focus:ring-0 resize-none"
                        maxLength={200}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {newMessage.length}/200 字
                        </span>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowForm(false)}
                            className="border-temple-gold-300"
                          >
                            取消
                          </Button>
                          <Button
                            type="submit"
                            variant="temple"
                            disabled={!newMessage.trim()}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            發送祈福
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Blessings Wall */}
      <section className="py-16 bg-gradient-to-b from-white to-temple-gold-50">
        <div className="container mx-auto px-4">
          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold font-temple text-temple-red-700">
                {blessings.length}
              </div>
              <div className="text-gray-600">則祈福</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold font-temple text-temple-red-700">
                {blessings.reduce((sum, b) => sum + b.likes, 0)}
              </div>
              <div className="text-gray-600">次祝福</div>
            </div>
          </div>

          {/* Blessings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {blessings.map((blessing, index) => (
              <motion.div
                key={blessing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-temple-gold-200 hover:border-temple-gold-400 hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-temple-gradient rounded-full flex items-center justify-center text-white text-lg">
                        🙏
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-temple-red-800">{blessing.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {blessing.date}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      「{blessing.message}」
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-temple-gold-100">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Flame className="w-4 h-4 text-temple-red-500" />
                        {blessing.temple}
                      </div>
                      <button
                        onClick={() => handleLike(blessing.id)}
                        className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{blessing.likes}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-temple-gold-400">
              載入更多祈福
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-temple-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white space-y-6">
            <h2 className="text-3xl font-temple font-bold">
              為自己和家人點燈祈福
            </h2>
            <p className="opacity-90">
              心誠則靈，讓神明保佑您事事順心
            </p>
            <Button variant="gold" size="lg" asChild>
              <a href="/temples">
                🏮 前往點燈
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}





