'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, ShoppingCart, CreditCard, CheckCircle, Flame, FileText, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CloudDecoration } from '@/components/temple/TempleDecoration'
import { Lantern } from '@/components/temple/Lantern'

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: <Search className="w-8 h-8" />,
      title: '選擇廟宇',
      description: '瀏覽我們合作的廟宇列表，選擇您想要點燈的廟宇。您可以依照地區、主祀神明來搜尋。',
      tips: ['可搜尋廟宇名稱或地區', '查看廟宇介紹與歷史', '確認廟宇提供的燈種']
    },
    {
      number: 2,
      icon: <Flame className="w-8 h-8" />,
      title: '選擇燈種',
      description: '每間廟宇提供不同的燈種，包含光明燈、財神燈、月老燈等。選擇適合您祈福需求的燈種。',
      tips: ['查看燈種功效說明', '確認供奉期限', '可一次點多盞燈']
    },
    {
      number: 3,
      icon: <FileText className="w-8 h-8" />,
      title: '填寫資料',
      description: '填寫點燈人的姓名、生辰（選填）以及祈福願望。這些資訊將由廟方用於點燈儀式。',
      tips: ['姓名請填寫正確', '生辰可增加靈驗度', '祈福願望簡潔明瞭']
    },
    {
      number: 4,
      icon: <CreditCard className="w-8 h-8" />,
      title: '安全付款',
      description: '支援信用卡、ATM 轉帳等多種付款方式。我們採用銀行等級的加密技術保護您的付款資訊。',
      tips: ['支援 VISA/MasterCard/JCB', 'ATM 虛擬帳號轉帳', '付款安全有保障']
    },
    {
      number: 5,
      icon: <CheckCircle className="w-8 h-8" />,
      title: '廟方點燈',
      description: '付款完成後，廟方將在 1-2 個工作天內為您點燈，並進行祈福儀式。',
      tips: ['廟方親自點燈', '進行祈福儀式', '燈火持續供奉']
    },
    {
      number: 6,
      icon: <Mail className="w-8 h-8" />,
      title: '收到證明',
      description: '點燈完成後，您將收到電子郵件通知，並可在會員中心下載點燈證明。',
      tips: ['Email 通知', '電子點燈證明', '可隨時查看狀態']
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-temple-gradient overflow-hidden">
        <div className="absolute inset-0 cloud-pattern opacity-20" />
        <CloudDecoration className="top-10 left-10" />
        <CloudDecoration className="top-20 right-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-temple font-bold drop-shadow-lg"
            >
              📖 如何點燈
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              簡單六步驟，輕鬆完成線上點燈祈福
            </motion.p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-gradient-to-b from-temple-gold-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-2 border-temple-gold-300 overflow-hidden hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Step Number */}
                      <div className="bg-temple-gradient p-8 flex items-center justify-center md:w-48">
                        <div className="text-center text-white">
                          <div className="text-6xl font-temple font-bold mb-2">
                            {step.number}
                          </div>
                          <div className="text-temple-gold-200">
                            {step.icon}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8">
                        <h3 className="text-2xl font-temple font-bold text-temple-red-800 mb-4">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.tips.map((tip, j) => (
                            <span
                              key={j}
                              className="px-3 py-1 bg-temple-gold-100 text-temple-red-700 rounded-full text-sm"
                            >
                              ✓ {tip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl font-temple font-bold text-temple-red-800">
              常見問題
            </h2>

            <div className="space-y-4 text-left">
              {[
                {
                  q: '點燈後多久會生效？',
                  a: '付款完成後，廟方會在 1-2 個工作天內為您點燈。點燈完成即刻生效，燈火會持續供奉至期限結束。'
                },
                {
                  q: '可以幫家人點燈嗎？',
                  a: '可以的！您可以為任何人點燈，只需在點燈資料中填寫該位家人的姓名即可。'
                },
                {
                  q: '如何確認燈已經點了？',
                  a: '點燈完成後，您會收到 Email 通知，也可以在會員中心查看訂單狀態並下載點燈證明。'
                },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border border-temple-gold-200">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-temple-red-800 mb-2">
                        Q: {faq.q}
                      </h4>
                      <p className="text-gray-600">
                        A: {faq.a}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Link href="/faq">
              <Button variant="outline" size="lg" className="border-temple-gold-400">
                查看更多常見問題
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-temple-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white space-y-8">
            <div className="flex justify-center gap-4">
              <Lantern size="md" color="gold" animate />
              <Lantern size="lg" color="red" animate />
              <Lantern size="md" color="gold" animate />
            </div>
            <h2 className="text-4xl font-temple font-bold drop-shadow-lg">
              準備好了嗎？
            </h2>
            <p className="text-xl opacity-90">
              立即開始為自己和家人點燈祈福
            </p>
            <Link href="/temples">
              <Button variant="gold" size="xl">
                🏮 開始點燈
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

