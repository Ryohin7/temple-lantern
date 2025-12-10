'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Flame, Shield, Award, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CloudDecoration, DragonDecoration } from '@/components/temple/TempleDecoration'
import { Lantern } from '@/components/temple/Lantern'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
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
              🙏 關於我們
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              連結傳統與現代，讓祈福更簡單
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-temple font-bold text-temple-red-800 mb-6">
                我們的使命
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                台灣點燈網致力於將傳統廟宇的點燈服務數位化，讓身處世界各地的信眾都能夠方便地為自己和家人點燈祈福。
                我們相信，科技應該服務於傳統文化的傳承，而不是取代它。
              </p>
            </motion.div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="w-10 h-10" />,
                  title: '心誠則靈',
                  description: '無論身在何處，只要心誠，神明都能感受到您的祈願。'
                },
                {
                  icon: <Shield className="w-10 h-10" />,
                  title: '安全可靠',
                  description: '與正規廟宇合作，確保每一盞燈都由廟方親自點燃。'
                },
                {
                  icon: <Globe className="w-10 h-10" />,
                  title: '打破距離',
                  description: '不論您在台灣還是海外，都能為家人點燈祈福。'
                },
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-2 border-temple-gold-300 h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center space-y-4">
                      <div className="text-temple-red-600 flex justify-center">
                        {value.icon}
                      </div>
                      <h3 className="text-2xl font-temple font-bold text-temple-red-800">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-to-b from-temple-gold-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <h2 className="text-4xl font-temple font-bold text-temple-red-800">
                  我們的故事
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  台灣點燈網創立於 2024 年，源自創辦人在海外工作時，無法親自回台灣為家人點燈的遺憾。
                </p>
                <p className="text-gray-600 leading-relaxed">
                  我們深知許多在海外的台灣人和華人，都有著同樣的心願——希望能為遠方的家人祈福。
                  於是，我們與台灣各地的廟宇合作，打造了這個線上點燈平台。
                </p>
                <p className="text-gray-600 leading-relaxed">
                  現在，無論您身在何處，都能透過我們的平台，為自己和家人點上一盞祈福的明燈。
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <Lantern size="lg" color="red" animate />
                  <div className="absolute -right-16 top-10">
                    <Lantern size="md" color="gold" animate />
                  </div>
                  <div className="absolute -left-12 top-20">
                    <Lantern size="sm" color="orange" animate />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-temple-gradient text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '100+', label: '合作廟宇', icon: '🏯' },
              { number: '50,000+', label: '點燈次數', icon: '🏮' },
              { number: '10,000+', label: '服務信眾', icon: '🙏' },
              { number: '8', label: '燈種選擇', icon: '✨' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="text-4xl">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-temple font-bold">
                  {stat.number}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-temple font-bold text-temple-red-800 mb-4">
              我們的團隊
            </h2>
            <p className="text-gray-600 text-lg">
              一群熱愛台灣文化的年輕人
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: '創辦人', role: '平台策劃', emoji: '👨‍💼' },
              { name: '技術長', role: '系統開發', emoji: '👨‍💻' },
              { name: '營運長', role: '廟宇合作', emoji: '🤝' },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-2 border-temple-gold-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="text-6xl">{member.emoji}</div>
                    <h3 className="text-xl font-temple font-bold text-temple-red-800">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

