'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { CloudDecoration } from '@/components/temple/TempleDecoration'

interface FAQ {
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  // 點燈相關
  {
    category: '點燈相關',
    question: '線上點燈和親自去廟裡點燈有什麼不同？',
    answer: '線上點燈與親自到廟裡點燈的效果是一樣的。我們與廟方合作，您在線上完成點燈後，廟方會親自為您點燈並進行祈福儀式。唯一的差別是您不需要親自到場，特別適合忙碌或在海外的信眾。'
  },
  {
    category: '點燈相關',
    question: '點燈後多久會生效？',
    answer: '付款完成後，廟方會在 1-2 個工作天內為您點燈。點燈完成即刻生效，燈火會持續供奉至期限結束。您會收到 Email 通知確認點燈完成。'
  },
  {
    category: '點燈相關',
    question: '可以幫家人或朋友點燈嗎？',
    answer: '可以的！您可以為任何人點燈祈福，只需在點燈資料中填寫該位親友的姓名即可。許多信眾會為父母、子女或好友點燈。'
  },
  {
    category: '點燈相關',
    question: '生辰資料一定要填嗎？',
    answer: '生辰資料為選填項目。填寫生辰可以讓廟方在祈福時更加精準，但不填寫也不影響點燈效果。心誠則靈，最重要的是您的誠心。'
  },
  {
    category: '點燈相關',
    question: '燈種有什麼差別？該選哪一種？',
    answer: '不同燈種針對不同的祈福需求：光明燈適合祈求平安順利、財神燈適合求財運、月老燈適合求姻緣、文昌燈適合求學業等。您可以根據自己的需求選擇，也可以同時點多種燈。'
  },
  // 付款相關
  {
    category: '付款相關',
    question: '支援哪些付款方式？',
    answer: '我們支援信用卡（VISA、MasterCard、JCB）以及 ATM 虛擬帳號轉帳。所有付款都經過銀行等級的加密保護，安全無虞。'
  },
  {
    category: '付款相關',
    question: '付款後可以退款嗎？',
    answer: '由於點燈服務的特殊性，一旦廟方已為您點燈，將無法退款。如果是付款後尚未點燈的情況，請聯繫客服處理。'
  },
  {
    category: '付款相關',
    question: '會收到收據嗎？',
    answer: '點燈完成後，您會收到電子點燈證明，可在會員中心下載。如需正式收據，請聯繫客服，我們會協助您向廟方申請。'
  },
  // 帳號相關
  {
    category: '帳號相關',
    question: '一定要註冊帳號才能點燈嗎？',
    answer: '目前需要註冊帳號才能點燈，這是為了讓您能夠查看訂單狀態、下載點燈證明。註冊過程非常簡單，只需 Email 和密碼即可。'
  },
  {
    category: '帳號相關',
    question: '忘記密碼怎麼辦？',
    answer: '在登入頁面點擊「忘記密碼」，輸入您的 Email，我們會寄送重設密碼的連結給您。'
  },
  // 廟宇相關
  {
    category: '廟宇相關',
    question: '平台上的廟宇都是正規廟宇嗎？',
    answer: '是的，我們只與經過審核的正規廟宇合作。每間廟宇都需要提供相關證明文件，確保信眾的權益。'
  },
  {
    category: '廟宇相關',
    question: '我是廟宇管理者，如何加入平台？',
    answer: '歡迎您加入！請前往「廟宇註冊」頁面填寫申請表，我們會在 1-3 個工作天內審核並與您聯繫。'
  },
  // 其他
  {
    category: '其他',
    question: '有客服可以詢問嗎？',
    answer: '有的！您可以透過 Email（contact@temple-lantern.tw）或電話（02-1234-5678）聯繫我們的客服團隊，服務時間為週一至週五 9:00-18:00。'
  },
  {
    category: '其他',
    question: '網站資料安全嗎？',
    answer: '我們採用 SSL 加密技術保護您的資料傳輸，付款資訊由第三方金流公司處理，我們不會儲存您的信用卡資料。您的個人資料僅用於點燈服務，不會外洩。'
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')

  const categories = ['全部', ...Array.from(new Set(faqs.map(f => f.category)))]

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '全部' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-temple-gradient overflow-hidden">
        <div className="absolute inset-0 cloud-pattern opacity-20" />
        <CloudDecoration className="top-10 left-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-temple font-bold drop-shadow-lg"
            >
              ❓ 常見問題
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl opacity-90 max-w-2xl mx-auto"
            >
              找不到答案？歡迎聯繫我們的客服團隊
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 border-2 border-temple-gold-300"
        >
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜尋問題..."
              className="pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-temple-red-600 text-white'
                    : 'bg-temple-gold-100 text-temple-red-700 hover:bg-temple-gold-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ List */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                找不到相關問題
              </h3>
              <p className="text-gray-600">
                請嘗試其他關鍵字，或直接聯繫客服
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`border-2 cursor-pointer transition-all ${
                    openIndex === index
                      ? 'border-temple-red-400 shadow-lg'
                      : 'border-temple-gold-200 hover:border-temple-gold-400'
                  }`}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <CardContent className="p-0">
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-xs text-temple-gold-600 bg-temple-gold-100 px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                        <h3 className="text-lg font-bold text-temple-red-800 mt-2">
                          {faq.question}
                        </h3>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 text-temple-gold-600 transition-transform ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0">
                            <div className="border-t border-temple-gold-200 pt-4">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-temple-gold-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-temple font-bold text-temple-red-800">
              還有其他問題嗎？
            </h2>
            <p className="text-gray-600">
              歡迎聯繫我們的客服團隊，我們很樂意為您解答
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@temple-lantern.tw"
                className="px-6 py-3 bg-temple-red-600 text-white rounded-lg font-medium hover:bg-temple-red-700 transition-colors"
              >
                📧 contact@temple-lantern.tw
              </a>
              <a
                href="tel:+886-2-1234-5678"
                className="px-6 py-3 bg-white text-temple-red-700 rounded-lg font-medium border-2 border-temple-gold-300 hover:bg-temple-gold-50 transition-colors"
              >
                📞 02-1234-5678
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


