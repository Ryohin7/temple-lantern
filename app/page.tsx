'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Flame, Heart, Sparkles, TrendingUp, BookOpen, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Lantern } from '@/components/temple/Lantern'
import { CloudDecoration, DragonDecoration, LotusDecoration, IncenseSmoke } from '@/components/temple/TempleDecoration'
import { PromoBanner } from '@/components/home/PromoBanner'
import { PromoSection } from '@/components/home/PromoSection'

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* 廣告 Banner */}
      <PromoBanner />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-temple-red-50 via-temple-orange-50 to-temple-gold-50 overflow-hidden">
        {/* 背景裝飾 */}
        <div className="absolute inset-0 cloud-pattern" />
        <CloudDecoration className="top-10 left-10" />
        <CloudDecoration className="top-20 right-20" />
        <DragonDecoration className="top-10 right-10 opacity-20" />
        <LotusDecoration className="bottom-20 left-20" />
        
        {/* 飄動的燈籠 */}
        <div className="absolute inset-0">
          <motion.div className="absolute top-20 left-[10%]">
            <Lantern size="md" color="red" />
          </motion.div>
          <motion.div className="absolute top-40 right-[15%]">
            <Lantern size="lg" color="gold" />
          </motion.div>
          <motion.div className="absolute bottom-32 left-[20%]">
            <Lantern size="md" color="orange" />
          </motion.div>
          <motion.div className="absolute bottom-20 right-[10%]">
            <Lantern size="sm" color="red" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* 主標題 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl md:text-8xl font-temple font-bold text-temple-red-700 mb-4 drop-shadow-lg">
                台灣點燈網
              </h1>
              <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl text-temple-gold-600 font-temple">
                <Flame className="w-8 h-8" />
                <span>心誠則靈，祈福點燈</span>
                <Flame className="w-8 h-8" />
              </div>
            </motion.div>

            {/* 副標題 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto"
            >
              連結傳統與現代，讓祈福更簡單
              <br />
              線上選擇廟宇、點燈種類，讓神明保佑您與家人
            </motion.p>

            {/* CTA 按鈕 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link href="/temples">
                <Button variant="temple" size="xl" className="min-w-[200px]">
                  <Flame className="w-5 h-5 mr-2" />
                  開始點燈祈福
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="xl" className="min-w-[200px] border-temple-gold-400">
                  <BookOpen className="w-5 h-5 mr-2" />
                  如何使用
                </Button>
              </Link>
            </motion.div>

            {/* 統計數字 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
            >
              {[
                { number: '100+', label: '合作廟宇', icon: '🏯' },
                { number: '50,000+', label: '信眾點燈', icon: '🏮' },
                { number: '8', label: '燈種選擇', icon: '✨' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold font-temple text-temple-red-700">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* 香煙效果 */}
        <IncenseSmoke className="bottom-0" />
      </section>

      {/* 燈種介紹 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-temple font-bold text-temple-red-800 mb-4">
              各式燈種，滿足不同祈福需求
            </h2>
            <p className="text-gray-600 text-lg">
              從傳統光明燈到專屬祈福燈，為您與家人獻上最誠摯的祝福
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🏮',
                name: '光明燈',
                description: '照亮前程，驅除黑暗',
                color: 'from-red-100 to-red-50',
                textColor: 'text-red-700'
              },
              {
                icon: '💰',
                name: '財神燈',
                description: '招財進寶，財源廣進',
                color: 'from-yellow-100 to-yellow-50',
                textColor: 'text-yellow-700'
              },
              {
                icon: '💕',
                name: '月老燈',
                description: '姻緣美滿，愛情順利',
                color: 'from-pink-100 to-pink-50',
                textColor: 'text-pink-700'
              },
              {
                icon: '📚',
                name: '文昌燈',
                description: '學業進步，金榜題名',
                color: 'from-blue-100 to-blue-50',
                textColor: 'text-blue-700'
              },
              {
                icon: '🙏',
                name: '平安燈',
                description: '闔家平安，身體健康',
                color: 'from-green-100 to-green-50',
                textColor: 'text-green-700'
              },
              {
                icon: '⭐',
                name: '太歲燈',
                description: '化解沖犯，諸事順利',
                color: 'from-purple-100 to-purple-50',
                textColor: 'text-purple-700'
              },
              {
                icon: '💼',
                name: '事業燈',
                description: '事業亨通，步步高升',
                color: 'from-indigo-100 to-indigo-50',
                textColor: 'text-indigo-700'
              },
              {
                icon: '❤️',
                name: '健康燈',
                description: '身體康健，疾病消除',
                color: 'from-rose-100 to-rose-50',
                textColor: 'text-rose-700'
              },
            ].map((lantern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`bg-gradient-to-br ${lantern.color} border-2 border-temple-gold-200 hover:shadow-lg transition-shadow cursor-pointer group`}>
                  <CardContent className="p-6 text-center space-y-3">
                    <motion.div
                      className="text-5xl"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {lantern.icon}
                    </motion.div>
                    <h3 className={`text-2xl font-temple font-bold ${lantern.textColor}`}>
                      {lantern.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {lantern.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 優惠專區 */}
      <PromoSection />

      {/* 使用流程 */}
      <section className="py-20 bg-gradient-to-b from-temple-gold-50 to-temple-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-temple font-bold text-temple-red-800 mb-4">
              簡單三步驟，輕鬆完成點燈
            </h2>
            <p className="text-gray-600 text-lg">
              省去奔波，在家也能虔誠祈福
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                icon: <Flame className="w-12 h-12" />,
                title: '選擇廟宇與燈種',
                description: '瀏覽各地廟宇，選擇適合的燈種與祈福項目'
              },
              {
                step: '2',
                icon: <Heart className="w-12 h-12" />,
                title: '填寫祈福資訊',
                description: '輸入您的姓名、生辰資訊與祈福願望'
              },
              {
                step: '3',
                icon: <Sparkles className="w-12 h-12" />,
                title: '完成付款點燈',
                description: '安全付款後，廟方將為您點燈並提供證明'
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-temple-gold-300 bg-white hover:shadow-xl transition-all group">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-temple-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold font-temple shadow-lg group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                    <div className="text-temple-red-600 flex justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-temple font-bold text-temple-red-800">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/temples">
              <Button variant="temple" size="xl">
                立即開始點燈 →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-temple-gradient relative overflow-hidden">
        <div className="absolute inset-0 cloud-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-temple font-bold drop-shadow-lg"
            >
              您是廟宇管理者嗎？
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90"
            >
              加入我們的平台，讓更多信眾能夠線上點燈祈福
              <br />
              提升廟務管理效率，擴大服務範圍
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/temple-admin/register">
                <Button variant="gold" size="xl" className="min-w-[200px]">
                  <Users className="w-5 h-5 mr-2" />
                  廟宇註冊申請
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}


